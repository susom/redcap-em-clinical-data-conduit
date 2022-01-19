# Clinical Data Conduit
## A REDCap EM for self-service clinical data integration.

Welcome to Stanford REDCap's Clinical Data Conduit, a self-service tool to automatically import clinical data associated with research subjects in your study.

Clinical data is always associated with (1) a patient, and (2) a date and time of day.

In order to automatically import clinical data, you must first supply the patient identifier and date or date and time of the defining event for your study.

The identifier is almost always the Stanford Medical Record Number (MRN) but may in some cases be another unique identifier such as a radiology accession number. At this time we only support Stanford MRN.

### Differences with REDCap to STARR Link
One difference between Clinical Data Conduit (CDC) and Redcap to STARR Link (R2SL) is that R2SL pulls custom SQL queries into REDCap
and requires REDCap consulting services to configure, 
whereas CDC is designed to be self service.  Some (many, we hope!) projects may be able to rely entirely on CDC but we expect that
there will continue to be a need for R2SL, since it will be very difficult for CDC to completely meet all clinical data integration needs for
every project. However, CDC will offer a very strong starting point and has the great advantage of being self-service.

Another difference is that CDC assumes you want one row per patient in your final dataset, whereas R2SL is fully custom and can be used to
insert time-series data into repeating forms if what you want is a dump of the raw data.

Another difference (initially at least) is that R2SL supports longitudinal as well as classic project design, whereas CDC is (initially) limited to classic projects.
We plan to eventually support longitudinal projects.

### Directory structure
mockup/ contains HTML and some art assets for an initial prototype of the user interface

