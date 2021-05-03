/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/file', 'N/log', 'N/record', 'N/ui/serverWidget'],
    /**
 * @param{file} file
 * @param{log} log
 * @param{record} record
 * @param{serverWidget} serverWidget
 */
    (file, log, record, serverWidget) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {

            var response = scriptContext.response
            var request = scriptContext.request
            var form = serverWidget.createForm({
                title: 'Work Order Calendar'
            });


            var today;
            var numrange;
            var daterange;
            var dateheaderrange;
            var dateheaders;
            var startdate;
            var enddate;

            if (request.method == 'GET'){
             today = new Date();
             numrange = Array.from(Array(7).keys());
             daterange = numrange.map(x => formatmmmdd(addDays(today, x)));
             dateheaderrange = daterange.map(x => "<th>" + x + "</th>")
             dateheaders = dateheaderrange.join('')

                startdate = new Date()
                enddate = addDays(startdate,7)
            }else{
                startdate = request.parameters.custpage_start_date !== "" ? new Date(request.parameters.custpage_start_date) : new Date()
                enddate = request.parameters.custpage_end_date !== "" ? new Date(request.parameters.custpage_end_date) : addDays(startdate,7)

                var days = ((enddate - startdate)/(1000 * 60 * 60 * 24)) + 1

                numrange = Array.from(Array(days).keys());
                daterange = numrange.map(x => formatmmmdd(addDays(startdate, x)));
                dateheaderrange = daterange.map(x => "<th>" + x + "</th>")
                dateheaders = dateheaderrange.join('')
            }

            form.addFieldGroup({
                id:'custpage_datefilterfield',
                label: 'Date Filter'
            })

            form.addFieldGroup({
                id:'custpage_table',
                label: 'Schedule'
            })

            var currentstart = form.addField({
                id:'custpage_current_start',
                label: 'Current Start',
                type: serverWidget.FieldType.DATE,
                container: 'custpage_datefilterfield'
            })

            currentstart.defaultValue = startdate
            currentstart.updateDisplayType({displayType: serverWidget.FieldDisplayType.INLINE})

            var currentend = form.addField({
                id:'custpage_current_end',
                label: 'Current End',
                type: serverWidget.FieldType.DATE,
                container: 'custpage_datefilterfield'
            })

            currentend.defaultValue = enddate
            currentend.updateDisplayType({displayType: serverWidget.FieldDisplayType.INLINE})


            form.addSubmitButton({
                label: 'Filter',
            });

            var startdatefield = form.addField({
                id: 'custpage_start_date',
                type: serverWidget.FieldType.DATE,
                label: 'Start Date',
                container: 'custpage_datefilterfield'
            });

            var enddatefield = form.addField({
                id: 'custpage_end_date',
                type: serverWidget.FieldType.DATE,
                label: 'End Date',
                container: 'custpage_datefilterfield'
            });

            var theInlineHTMLFld = form.addField({
                id: 'custpage_inline_html_fld',
                type: serverWidget.FieldType.INLINEHTML,
                label: 'Field for Data Table',
                container: 'custpage_table'
            });

            var dtCssCdn = '<link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.10.20/css/jquery.dataTables.css">';
            var dtJqueryCdn = '<script type="text/javascript" language="javascript" src="https://code.jquery.com/jquery-3.3.1.js"></script>';
            var dtJsCdn = '<script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/1.10.20/js/jquery.dataTables.js"></script>';
            var dataTableHtml = '<table id="data_table_items" class="display" style="width: 100%"><thead><tr><th>Item</th>' + dateheaders + '</tr></thead><tbody id="data_table_items_body"></tbody></table>';
            var executeDataTableHtml = '<script>jQuery(document).ready(function (){jQuery("#data_table_items").DataTable();});</script>';

            theInlineHTMLFld.defaultValue = '<!DOCTYPE html><html lang="e"><html><head><meta charset="UTF-8">' + dtCssCdn + dtJqueryCdn + dtJsCdn + '</head><body>' + dataTableHtml + executeDataTableHtml;
            response.writePage(form)

            form.clientScriptFileId  = "20802"

            function formatmmmdd(dt){
                const months = ["JAN", "FEB", "MAR","APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
                return months[dt.getMonth()] + "-" + dt.getDate()
            }

            function addDays(date, days) {
                var result = new Date(date);
                result.setDate(result.getDate() + days);
                return result;
            }
        }

        function days_between(date1, date2) {

            // The number of milliseconds in one day
            const ONE_DAY = 1000 * 60 * 60 * 24;

            // Calculate the difference in milliseconds
            const differenceMs = Math.abs(date1 - date2);

            // Convert back to days and return
            return Math.round(differenceMs / ONE_DAY);

        }

        return {onRequest}

    });
