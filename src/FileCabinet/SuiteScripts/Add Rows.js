/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/search'],

function(search) {

    /**
     * Function to be executed after page is initialized.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.mode - The mode in which the record is being accessed (create, copy, or edit)
     *
     * @since 2015.2
     */
    function pageInit(scriptContext) {
        var record = scriptContext.currentRecord
        console.log("yolo")
        var mysearch = search.load({id:'customsearchwork_order_calendar'})
        var startdate = record.getValue('custpage_current_start')
        var endate = record.getValue('custpage_current_end')
        console.log(startdate)
        console.log(endate)


        var newfilters = [];

        newfilters.push(search.createFilter({
            name: 'startdate',
            operator: search.Operator.WITHIN,
            // values: [startdate, endate]
            values: [datetoddmmyyyy(startdate), datetoddmmyyyy(endate)]
        }));


        var standardsearch = search.load({id: 'customsearchwork_order_calendar'});

        var oldfilters = standardsearch.filters;
        for (var i = 0; i < newfilters.length; i++) {
            oldfilters.push(newfilters[i]);
        }
        standardsearch.filters = oldfilters;

        var searchresult = standardsearch.run();

        var orders= new Object()

        searchresult.each((line) => {
            orders[line.getValue({name:"displayname",join:"item"})] = new Object()
            return true
        })

        searchresult.each((line) => {
            var item = line.getValue({name:"displayname",join:"item"});
            var proddate = line.getValue("startdate");
            var quantity = line.getValue("quantity");
            var iid = line.getValue("internalid")
            orders[item][proddate] = [quantity,iid];
            return true
        })

        if (orders == {}){
            return
        }

        jQuery('.dataTables_empty').remove()

        for (const [key, value] of Object.entries(orders)) {
            console.log(key);
            var datearray = []
            datearray.push(key)
            for (var d = new Date(startdate); d <= endate; d.setDate(d.getDate() + 1)) {
                // console.log(d);
                // console.log(value[datetoddmmyyyy(d)] || "")
                if (typeof value[datetoddmmyyyy(d)] == "undefined"){
                    datearray.push("")
                }else {
                    var account = document.location.href.split("/")[2].split(".")[0]
                    var handle = `https://${account}.app.netsuite.com/app/accounting/transactions/workord.nl?id=`
                    var link = '<a href=' + handle + value[datetoddmmyyyy(d)][1] + '&whence= target="_blank">' + value[datetoddmmyyyy(d)][0] + "</a>"
                    datearray.push(link)
                }
            }
            console.log(datearray);
            // var htmtablerow = "<tr><td>" + datearray.join("</td><td>") + "</td></tr>"
            // document.querySelector('#data_table_items_body').insertAdjacentHTML('beforeend', htmtablerow);
            jQuery("#data_table_items").DataTable().row.add(datearray).draw()
        }


        console.log(orders)

        function datetoddmmyyyy(mydate) {
            var dd = mydate.getDate();
            var mm = mydate.getMonth() + 1;
            var yyyy = mydate.getFullYear();
            if (dd < 10) {
                dd = "0" + dd;
            }
            if (mm < 10) {
                mm = "0" + mm;
            }
            var formatteddate = mm + "/" + dd + "/" + yyyy;
            return formatteddate
        }

        }





        // var parsedresults = getAllSSResults(standardsearch)

    //     function getAllSSResults(s) {
    //         var results = s.run();
    //         var searchResults = [];
    //         var searchid = 0;
    //         do {
    //             var resultslice = results.getRange({start:searchid,end:searchid+1000});
    //             resultslice.forEach(function(slice) {
    //                     searchResults.push(slice);
    //                     searchid++;
    //                 }
    //             );
    //         } while (resultslice.length >=1000);
    //         return searchResults;
    //     }
    // }


    return {
        pageInit: pageInit,

    };
    
});
