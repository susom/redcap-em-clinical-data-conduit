# DUSTER - Data Upload Service for Translational rEsearch on Redcap
## A REDCap EM for self-service clinical data integration.

Welcome to Stanford REDCap's DUSTER, a self-service tool to automatically import clinical data associated with research subjects in your study.

Clinical data is always associated with (1) a patient, and (2) a date and time of day.

In order to automatically import clinical data, you must first supply the patient identifier and date or date and time of the defining event for your study.

The identifier is almost always the Stanford Medical Record Number (MRN) but may in some cases be another unique identifier such as a radiology accession number. At this time we only support Stanford MRN.

### Differences with REDCap to STARR Link
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

### Installation 
To install as a developer, check out this project in your modules-local directory with a suitable version suffix
e.g. git clone git@github.com:susom/redcap-em-duster.git duster_v9.9.9,
then in your local redcap browse to Control Center, scroll down to the very bottom on the left hand side
and click on the "Manage" link next to the heading "External Modules".
On the "External Modules - Module Manager" screen scroll to Duster, and click "Enable"

### Use Instructions
To use DUSTER, click on "+ New Project", supply a title and purpose,
then select "Create project using DUSTER" from the "Project creation option" radio button group.