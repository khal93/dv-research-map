//set-data.js
// Author: Khaleeq Ahmad     Date: November 2014
//Takes live JSON data from Research Perspectives website. This data is formatted into a hierchial array for input into the tree, flat data for the organisations is also required for the map.
d3.json("http://www.researchperspectives.org/DV/?database=release", function(dbroot) {
//d3.json("json/database.json", function(error, dbroot) { //for offline testing faster performance

        /////from index

    var grants = dbroot.grants;
    var persons = dbroot.persons;
    orgs = dbroot.organisations;
    ukOrgs = [];


//            //filter for uk orgs only
//            for (var o = 0; o < orgs.length; o++)
//            {
//                var thisOrg = orgs[o];
//
//                if (thisOrg["Country"] == "Scotland" || "England" || "Wales" || "Northern Ireland")
//                {
//                    ukOrgs.push(thisOrg);
//                }
//            }
//            orgs = ukOrgs;


//
//            org2 = orgs.filter (function (arr) {
//                return arr.Country !== "Scotland";
//            });

//    console.log(orgs);


    x = 0;
    for (var o = 0; o < orgs.length; o++)
    {
        var thisOrg = orgs[o];
        var thisOrgsGrants = thisOrg.children = new Array();

//                        var thisGrant = new Object();
//                        thisGrant.Name = "";
//                        grantObject._children = [d];

        //filter to just uk orgs for map


//           var personCount = 0;
//            console.log(personCount);
////
//            for(var pp = 0; pp < persons.length; pp++)
//            {
//                if (persons[pp]["OrgID"] == thisOrg["ID"]) {
//                    personCount++;
////                    console.log(yes);
////                    thisOrg["Persons"].push(persons[pp]);
//                }
//            }

//            thisOrg["PersonCount"] = personCount;


        for (var gra = 0; gra < grants.length; gra++)
        {


            //add investigator details
            var investigators = grants[gra]["Investigators"];
            for (var inv = 0; inv < investigators.length; inv++) {

                for (var p = 0; p < persons.length; p++) {
//                      console.log(grants[g]["Investigators"][i]);
//                  console.log("P="+persons[p]["ID"]);

//                        var noPersons = 0;
//
//                        if (thisOrg.ID == persons[p]["OrgID"])
//                        {
//                            noPersons++;
////                            console.log(persons[p]["OrgID"]);
//                        }
//                        thisOrg["PersonsCount"] = noPersons;


                    if (investigators[inv]["ID"] == persons[p]["ID"])
                    {
                        for (j=0; j < grants[gra]["Investigators"].length; j++) {
//                          grants[g]["Investigators"].push(persons[p]);
//                      }
                            var name = persons[p]["Title"] + " " + persons[p]["Initials"] + " " + persons[p]["Surname"];
                            investigators[inv]["Name"] = name;
                            investigators[inv]["Department"] = persons[p]["Department"];

                            var orgID = persons[p]["OrgID"];
                            investigators[inv]["Organisation"] = orgs[orgID]["Name"]
                        }

                    }

                }
            }

            //add each grant as child of org
            if (thisOrg.OrgID == grants[gra]["OrgID"])
            {
                thisOrgsGrants.push(grants[gra]);
            }
            //add number of grants for easy sorting later
            thisOrg["GrantsCount"] = thisOrgsGrants.length;





        }

        //copy investigators to child of grant
        for (var og = 0; og < orgs[o]["children"].length; og++)
        {
//                    console.log (o + "," +  gra);
//                    console.log(orgs[o]["children"][gra]);
            orgs[o]["children"][og]["children"] = orgs[o]["children"][og]["Investigators"]

        }


    }


//            for (var o = 0; o < orgs.length; o++)
//            {
//                for (var og = 0; og < orgs[o]["children"].length; og++)
//                {
////                    console.log (o + "," +  gra);
////                    console.log(orgs[o]["children"][gra]);
//                    orgs[o]["children"][og]["children"] = orgs[o]["children"][og]["Investigators"]
//
//                }
//
//            }
//            console.log(ukOrgs);
//            console.log(orgs[0]["children"][0]);


//        function countIds(org, array, field)
//        {
//
//            count = 0;
//
//            for(var i = 0; i < array.length; i++)
//            {
//                if (array[i][field] == org) {
//                    count++;
//                }
//
//            }
//
//            return count;
//        }


    //    add counts to orgs arrqy for easy sorting...
//        for(var o = 0; o < orgs.length; o++) {
//
//            grantsCount = countIds(orgs[i]["OrgID"], children, "OrgID");
//            personsCount = countIds(orgs[i]["OrgID"], persons, "OrgID");
//
//            orgs[i]["GrantsCount"] = grantsCount;
//            orgs[i]["PersonsCount"] = personsCount;
//
//        }



//        var cleanArray = [];
//        for(var i = 0; i < orgs.length; i++)
//        {
//            x = orgs[i];
//            if(x.length >0) {
//                cleanArray.push(orgs[i]);
////                console.log(i);
//            }
//        }



    hierchOrgs =   {"Name": "Organisations", "children": orgs }; //orgs: for all orgs


    console.log(hierchOrgs);




//            flare = {"Name": "Organisations", "children":
//        [
//            {"Name": "x", "stat": "y", "children":
//                [
//                    {"Name": "x", "stat": "y"},{"Name": "x", "stat": "y"},{"Name": "x", "stat": "y"}
//                ]
//            }
//        ]
//    };
//    flare = hierchOrgs;
    var root = hierchOrgs;
    updateMap(orgs); //send flat data to map
    plantTree(root); //send hierchial data to tree

//    d3.select(".chart")
//        .selectAll("div")
//        .data(orgs[0].children)
//        .enter().append("div")
//        .style("width", function(d) { return d * 10 + "px"; })
//        .text(function(d) { return d; });
});
