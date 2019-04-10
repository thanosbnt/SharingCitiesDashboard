import os

from flask_restful import Resource, reqparse, inputs
from flask_jwt_extended import jwt_required, get_jwt_claims
import requests
import logging

logging.basicConfig(level='INFO')
logger = logging.getLogger(__name__)


class TestKeyValidity(Resource):
    """
    API endpoint, test whether the current sendgrid api key is valid
    """

    @jwt_required
    def get(self) -> (dict, int):
        """
        GET request endpoint. Send POST request to Sendgrid to test the
        validity of the current api key
        :return: a dictionary containing boolean value indicating the
                 validity of the api key and a reason if the key is invalid
        """
        if get_jwt_claims()["admin"]:
            sendgrid_api_key = os.environ.get('SENDGRID_API_KEY')
            if sendgrid_api_key:
                sendgrid_response = \
                    SendgridHelper.send_test_request(sendgrid_api_key)

                return \
                    SendgridHelper.handle_sendgrid_response(sendgrid_response)

            else:
                logger.error("Sendgrid API is not set as an environment "
                             "variable")
                return {
                    "api_key": False,
                    "reason": "Sendgrid API key is not set in the environment "
                              "variables"
                }, 200
        else:
            return {"message": "Not Authorized"}, 403


class ReplaceKey(Resource):
    """
    API endpoint, replace the current Sendgrid API key environment variable
    """

    reqparser = reqparse.RequestParser()
    reqparser.add_argument('new_api_key', required=True,
                           help='new api key is required', store_missing=False)

    @jwt_required
    def post(self) -> (dict, int):
        """
        POST request endpoint. Test whether new API key is valid and if so,
        replace the current Sendgrid API environment variable
        :return: a dictionary containing boolean value indicating whether
                 the replacement procedure was successful
        """

        if get_jwt_claims()["admin"]:
            args = self.reqparser.parse_args()
            new_api_key = args["new_api_key"]
            sendgrid_response = SendgridHelper.send_test_request(new_api_key)
            result, _ = \
                SendgridHelper.handle_sendgrid_response(sendgrid_response)

            if result["api_key"]:
                is_replaced, reason = self.replace_sendgrid_key(new_api_key,
                                                                "~",
                                                                ".bash_profile")
                if is_replaced:
                    os.environ["SENDGRID_API_KEY"] = new_api_key
                    logger.info("Sendgrid API key has been replaced "
                                "with new key = {}".format(new_api_key))
                    return {"message": "success"}, 200
                else:
                    return {
                        "message": "failure",
                        "reason": reason
                    }, 422
            else:
                return {"message": "failure", "reason": result["reason"]}, 422
        else:
            return {"message": "Not Authorized"}, 403

    @staticmethod
    def replace_sendgrid_key(new_api_key: str, folder: str,
                             file: str) -> (bool, str):
        """
        Replace Sendgrid API key environment variable export statement
        within the provided file argument
        :param new_api_key: Sendgrid API key that will replace the current
        :param folder: Name of folder that contains the shell configuration
                       file
        :param file: Name of shell configuration file
        :return: Whether the replacement process was successful and a
                 reason if the process failed
        """

        if folder == "~":
            folder = os.path.expanduser('~')

        file_path = folder + "/" + file
        try:
            filein = open(file_path, 'r')
        except FileNotFoundError:
            return False, "Unable to find file {}".format(file_path)

        found = False
        new_lines = []
        line = filein.readline()
        while line:
            if "export SENDGRID_API_KEY=" in line:
                found = True
                line = "export SENDGRID_API_KEY='{}'".format(new_api_key)

            new_lines.append(line)
            line = filein.readline()

        new_lines.append('\n')
        filein.close()

        if found:
            fileout = open(file_path, 'w')
            fileout.writelines(new_lines)
            fileout.close()
            return True, None
        else:
            logger.error("The required `export SENDGRID_API_KEY` statement "
                         "is not present within{}".format(file_path))
            return False, "Could not replace API key as it does not exist"


class SendgridHelper:
    """ Helper Class. Contains methods used by Sendgrid Resource classes """

    @staticmethod
    def send_test_request(sendgrid_api_key: str) -> requests.Response:
        """
        Send POST request to the Sendgrid test endpoint containing
        the the supplied API key
        :param sendgrid_api_key: Key whose validity is to be tested
        :return: The HTTP response received from Sendgrid
        """

        headers = {
            "Content-Type": "application/json",
            "Authorization": "Bearer {}".format(sendgrid_api_key)
        }
        data = {"personalizations":
                    [{"to": [{"email": "recipient@example.com"}]}],
                "from": {"email": "sendeexampexample@example.com"},
                "subject": "HelloWorld!",
                "content": [{"type": "text/plain", "value": "Howdy!"}]
                }

        return requests.post("https://api.sendgrid.com/v3/mail/send",
                             headers=headers, json=data)

    @staticmethod
    def handle_sendgrid_response(
            sendgrid_response: requests.Response) -> (dict, int):
        """
        Return the applicable feedback according to the supplied Sendgrid
        response
        :param sendgrid_response: An HTTP response from the Sengrid test
                                  endpoint
        :return: a dictionary containing whether the API key is valid and
                 the corresponding response code
        """

        if sendgrid_response.status_code == 202:
            return {"api_key": True, "reason": ""}, 200
        elif sendgrid_response.status_code == 401:
            logger.critical("Current Sendgrid API key environment variable is "
                            "invalid. Please replace this environment "
                            "variable with a new authorized Sengrid API key "
                            "and replace the export statement in "
                            "~/.bash_profile with this key")
            response_json = sendgrid_response.json()
            return {
                       "api_key": False,
                       "reason": response_json["errors"][0]["message"]
                   }, 200
        else:
            return {
                       "api_key": None,
                       "reason": "error while making request to Sengrid. "
                                 "Response code from Sengrid = {}"
                                 "".format(sendgrid_response.status_code)
                   }, 500