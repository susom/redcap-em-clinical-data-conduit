# DUSTER - Data Upload Service for Translational rEsearch on Redcap
## A REDCap EM for self-service clinical data integration.

Welcome to Stanford REDCap's DUSTER, a self-service tool to automatically import clinical data associated with research subjects in your study.

Clinical data is always associated with (1) a patient, and (2) a date and time of day.

In order to automatically import clinical data, you must first supply the patient identifier and date or date and time of the defining event for your study.

The identifier is almost always the Stanford Medical Record Number (MRN) but may in some cases be another unique identifier such as a radiology accession number. At this time we only support Stanford MRN.

## Differences with REDCap to STARR Link
One difference between DUSTER and Redcap to STARR Link (R2SL) is that R2SL pulls custom SQL queries into REDCap
and requires REDCap consulting services to configure,
whereas DUSTER is designed to be self service.  Some (many, we hope!) projects may be able to rely entirely on DUSTER but we expect that
there will continue to be a need for R2SL, since it will be very difficult for DUSTER to completely meet all clinical data integration needs for
every project. However, DUSTER will offer a very strong starting point and has the great advantage of being self-service.

Another difference is that DUSTER assumes you want one row per patient in your final dataset, whereas R2SL is fully custom and can be used to
insert time-series data into repeating forms if what you want is a dump of the raw data.

Another difference (initially at least) is that R2SL supports longitudinal as well as classic project design, whereas DUSTER is (initially) limited to classic projects.
We plan to eventually support longitudinal projects.

### Directory structure
mockup/ contains HTML and some art assets for an initial prototype of the user interface

## User Instructions
To use DUSTER, click on "+ New Project". On this page, enter a title, choose "Research" as the purpose, enter a valid IRB,
then select "Create project using DUSTER" from the "Project creation option" radio button group

## Dependencies

### REDCap to STARR Link EM, Vertx Token Lookup EM, and IRB Validity Lookup EM
For appropriate installation/configuration of these EMs, refer to these REDCap to STARR Link documents hosted on Google Drive:

- [REDCap to STARR Link dependencies](https://docs.google.com/document/d/1V_p7GJ8da8iWb9AH-MMjpD5xEQf3ExPRGizHMy8oPBk/edit)

- [REDCap to STARR Link](https://docs.google.com/document/d/1X-6_yge5LBe7I3mXoBtMCP5YCMkqnP0BktZD7riyoRY/edit)

Only system-level configuration should be required for these EMs.

## How to install and set up in local environment
Ensure that you are running on REDCap 12.2.4 and PHP 7.3.33.

### Install and enable
Place a copy of the EM into your local REDCap server's directory for external modules.
Make sure the folder's name ends with a '_v9.9.9' suffix (e.g., `duster_v9.9.9`).

As an example, you could perform the following on a CLI while in your `modules_local` directory:

`git clone git@github.com:susom/redcap-em-duster.git duster_v9.9.9`

To enable the EM on your local REDCap server:
1. Navigate to the Control Center
2. On the very bottom of the left panel: Click on the "Manage" link next to the "External Modules" heading
3. On the "External Modules - Module Manager" screen: Click the green "Enable a module" button
4. On the popup screen "Available Modules": Click the green "Enable" button for Duster

### Required System-Level Configuration

#### Allowlist
To prevent DUSTER from being visible to a broader userbase, users can only see DUSTER as an option when creating a new project if they in the allowlist.
For a user to be part of the allowlist, their REDCap username (i.e., SUNet) must be entered in this setting.

#### STARR-API Metadata Webservice URL
You may set this to `https://starr-dev.med.stanford.edu/duster/api/v1/metadata`.

Alternatively, this URL may instead point to your local STARR-API deployment's endpoint for getting DUSTER's metadata.
The URL pathname is `/duster/api/v1/metadata`.
>##### Example
>My local STARR-API server listens at `http://127.0.0.1:8889` or `http://localhost:8889`.
Therefore, the endpoint URL should be `http://127.0.0.1:8889/duster/api/v1/metadata` or `http://localhost:8889/duster/api/v1/metadata`.
However, my local REDCap's server resides in a Docker container so `localhost` in the REDCap server's perspective refers to the Docker container, not the host machine.
Thus, in order for my local REDCap server to correctly point to my local STARR-API server's metadata endpoint, I use `http://host.docker.internal:8889/duster/api/v1/metadata`.

#### STARR-API Config Webservice URL
You may set this to `https://starr-dev.med.stanford.edu/duster/api/v1/config`.

Alternatively, this URL may instead point to your local STARR-API deployment's endpoint for saving a DUSTER project config in starrapi db.
The URL pathname is `/duster/api/v1/config`.
>##### Example
>My local STARR-API server listens at `http://127.0.0.1:8889` or `http://localhost:8889`.
Therefore, the endpoint URL should be `http://127.0.0.1:8889/duster/api/v1/config` or `http://localhost:8889/duster/api/v1/config`.
However, my local REDCap's server resides in a Docker container so `localhost` in the REDCap server's perspective refers to the Docker container, not the host machine.
Thus, in order for my local REDCap server to correctly point to my local STARR-API server's metadata endpoint, I use `http://host.docker.internal:8889/duster/api/v1/config`.

#### STARR-API Data Webservice URL
You may set this to `https://starr-dev.med.stanford.edu/duster/api/v1/getData`.

Alternatively, this URL may instead point to your local STARR-API deployment's endpoint for fetching data.
The URL pathname is `/duster/api/v1/getData`.
>##### Example
>My local STARR-API server listens at `http://127.0.0.1:8889` or `http://localhost:8889`.
Therefore, the endpoint URL should be `http://127.0.0.1:8889/duster/api/v1/getData` or `http://localhost:8889/duster/api/v1/getData`.
However, my local REDCap's server resides in a Docker container so `localhost` in the REDCap server's perspective refers to the Docker container, not the host machine.
Thus, in order for my local REDCap server to correctly point to my local STARR-API server's metadata endpoint, I use `http://host.docker.internal:8889/duster/api/v1/getData`.

### Project-Level Configuration
No project-level configuration is necessary. However, it is helpful to enable emLogger.

## STARR-API Specifications
The DUSTER EM relies on STARR-API's DUSTER web services.
This section describes the purpose and specification of each service.

***IMPORTANT- As DUSTER's development progresses, specification requirements are subject to change.***

### Metadata Web Service
TODO

### Config Web Service
TODO

### Data Web Service
This endpoint retrieves STARR data and performs any required post-processing before sending the results back to the DUSTER EM (at the project level).

When making requests to this endpoint, note that only cohort information is required to be sent as part of the request.
This is because REDCap projects using the DUSTER EM have their DUSTER configurations saved in STARR-API's database.
#### Request Specifications
- URL pathname: `/duster/api/v1/getData`
- Request method: POST
- Authorization: Bearer (using 'ddp' token via Vertx Token Lookup EM)
- Content-Type: application/json
- POST parameters
  - `redcap_project_id` (integer)
    - The REDCap project ID (i.e., REDCap pid)
  - `cohort` (array of objects)
    - Contains the cohort information provided by the researcher in their REDCap project
    - Each object in this array represents a record in the REDCap project and includes the following parameters:
      - `redcap_record_id` (string)
      - `mrn` (string)
        - format: 8-digit with leading zeros
      - `dates` (array of objects)
        - Each object in this array represents a researcher-provided date/datetime and includes the following parameters:
          - `redcap_field_name` (string)
          - `value` (string)
            - format: YYYY-MM-DD or YYYY-MM-DD HH:MM:SS
          - `type` (string)
            - the value of this parameter should be "date" or "dttm", depending on if the object represents a date ("date") or datetime ("dttm")
##### Example of JSON body sent as part of a data web service request
```
{
    "redcap_project_id": 1,
    "cohort": [
        {
            "redcap_record_id": "1",
            "mrn": "01234567",
            "dates": [
                {
                    "redcap_field_name": "study_enroll_date",
                    "value": "2022-12-31",
                    "type": "date"
                },
                {
                    "redcap_field_name": "d0_blood_dttm",
                    "value": "2022-12-31 12:34:00",
                    "type": "dttm"
                }
            ]
        }
    ]
}
```

#### Response Specifications
TODO

## Psalm Taint Analysis
To perform Psalm Taint Analysis - while in DUSTER EM's directory, enter in a command-line interface: `./vendor/bin/psalm --taint-analysis`
