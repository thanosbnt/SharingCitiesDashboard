Analytics: [![wercker status](https://app.wercker.com/status/350323c0db166acb5049b26ec2330f42/s/master "wercker status")](https://app.wercker.com/project/byKey/350323c0db166acb5049b26ec2330f42)  Frontend: [![CircleCI](https://circleci.com/gh/FutureCitiesCatapult/SharingCitiesDashboard/tree/master.svg?style=svg)](https://circleci.com/gh/FutureCitiesCatapult/SharingCitiesDashboard/tree/master)



# Sharing Cities Dashboard

![](images/logo.jpg)


## Introduction
### What is sharing cities?
Sharing Cities, the European Commission funded Horizon 2020 project, seeks to create a better, common approach to making smart cities a reality. By fostering international collaboration between industry and cities, the project seeks to develop affordable, integrated, commercial-scale smart city solutions with a high market potential. For more information on the project click [here](http://www.sharingcities.eu/).

### What is this tool?
This tool, provides an interface to city managers for visualising and monitoring the performance of smart city measures such as those relating to housing retrofit, integrated energy management, shared eMobility and smart lampposts. Different combinations of these 'measures' have been deployed in Greenwich, Lisbon and Milan and so this dashboard caters for each location specifically. 

To supply data to the dashboard, each city is hosting an Urban Sharing Platform (USP), which makes data from the Sharing Cities smart city measures available through APIs. In some cases, the dashboards also integrate information from other locally relevant APIs such as weather. 

### What is our vision?
Users of this dashboard will have expertise from a broad range of domains. This includes city managers, heads of service in energy, transport and the environment and potentially even the public. As a result, when investigating data from the measures, the needs of each individual are very different meaning that we cannot custom-build a tool for all needs. 

To circumvent this challenge, we have developed a tool that enables users to create interactive visualisations tailored to their needs. The users will be able to:

- Explore the data available to them through the USP in their city
- Perform forecasting on data from specific sensors or specific time-series
- Create visualisations that they want on their dashboard
- Create thresholds on specific attributes that can trigger 'alerts' in the dashboard

This repo holds the code, deployment configuration and instructions on how to use the SharingCities dashboard. The implementation of the dashboard consists of three parts:

- ***[Importers](/Documentation/importers.md)***
    * Importers are used to source open or propriety data from different APIs and providers. Examples incluse data related to air quality, traffic counts, parking spots etc.
- ***[Backend architecture](/Documentation/backend_architecture.md)***
    * A [Flask](https://flask.palletsprojects.com/en/1.1.x/) based backend server and database structure.
- ***[Frontend](/Documentation/frontend.md)***
    * A frontend implementation based on [React](https://reactjs.org/)


## Table of Contents:

- [Introduction](#introduction)
- [Description](#description)
    * [Backend](#backend)
- [Requirements](#requirements)
- [Installing and setting up host](#installing-and-setting-up-the-host)
- [Quick Start](#quick-start)






## Deployment 

## Modules

### Back end
### Analytics
### Front end

## Quick-start







