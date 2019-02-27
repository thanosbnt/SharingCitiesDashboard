from http import HTTPStatus

from flask_jwt_extended import jwt_required, get_jwt_claims
from flask_restful import Resource
from flask_restful import reqparse

from models.theme import Theme


class DeleteTheme(Resource):
    """
    delete an existing Theme entry in the database
    """

    def __init__(self) -> None:
        """
        renames a existing Theme entry in the database
        """
        self.reqparser = reqparse.RequestParser()
        self.reqparser.add_argument('name', required=False, store_missing=False,
                                    type=str, help='Current theme name required',
                                    location=['form', 'json'])
        self.reqparser.add_argument('id', required=False, store_missing=False, type=str,
                                    help='New theme name required', location=['form', 'json'])

    @jwt_required
    def post(self) -> ({str: str}, HTTPStatus):
        """
        renames a existing Theme entry in the database
        :post_argument  name: the name of the theme to be deleted
        :post_argument id: id of the theme to be deleted
        :post_type  name: str
        :post_type  id: str
        """
        if not get_jwt_claims()['admin']:
            return {"error": "administration privileges required"}, HTTPStatus.FORBIDDEN

        # Get arguments
        args = self.reqparser.parse_args()

        # does the theme exist?
        theme = Theme.get_by_name(args["name"]) if "name" in args else Theme.get_by_id(args["id"])
        if not theme:
            # cannot rename a theme that does not exist.
            return {'error': 'Theme does not exists.', 'id': " ", 'name': args["name"]}, HTTPStatus.BAD_REQUEST

        # delete the theme
        theme.delete()
        theme.commit()

        return ({
                    "message": "Theme deleted",
                    "id": theme.id,
                    "name": theme.name
                }, HTTPStatus.OK)
