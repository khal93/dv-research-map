//zoom-map.js
// Author: Khaleeq Ahmad     Date: November 2014
//Creates a UK Map based on almers using Topojson and UK geographical data. Includes 'pins' for each organisation, which are resized on the number of grants each organisation hold sin order to create a 'Bubble Map'
//Map initially based on Mike Chantler lecture example from labwork. Zooming behaviour taken from Bostock example - Zoom to Bounding Box II (http://bl.ocks.org/mbostock/9656675). Adapted to UK map as per lectures.

var width = 500,
    height = 850,
    active = d3.select(null);

var projection = d3.geo.albers()//**
    .center([0, 55.4])
    .rotate([4.4, 0])
    .parallels([50, 60])
    .scale(4500)
    .translate([width / 3, (height / 3)+30]);


var zoom = d3.behavior.zoom()
    .translate([0, 0])
    .scale(1)
    .scaleExtent([1, 8])
    .on("zoom", zoomed);

var path = d3.geo.path()
    .projection(projection);

var svgM = d3.select("body").append("svg")
    .attr("id", "zoom-map")
    .attr("width", width)
    .attr("height", height)
    .on("click", stopped, true);

svgM.append("rect")
    .attr("class", "background")
    .attr("width", width)
    .attr("height", height)
    .on("click", reset);

var gM = svgM.append("g");

svgM
    .call(zoom) // delete this line to disable free zooming
    .call(zoom.event);


//Define path generator (takes projected 2D geometry and formats for SVG)
var pathGen = d3.geo.path()
    .projection(projection)
    .pointRadius(2);

//take UK geographical data from attached file
d3.json("json/uk.json", function(error, uk) {


//        //Extract * convert ENG,IRL,NIR,SCT,WLS TopoJSON data into to GeoJSON
//        var subunits = topojson.feature(uk, uk.objects.subunits);
//        //Ditto for places (cities)
//        var places = topojson.feature(uk, uk.objects.places);
//        var cities =[[-3.1889,55.9531], [-4.2590,55.8580], [-0.1275, 51.5072]];
//
//        console.log("uk = ", uk); console.log("subuits = ", subunits); console.log("places = ", places);

    //now do DATA JOIN ENTER for country outlines and city dots & labels

//        Draw the five unit outlines (ENG, IRL, NIR, SCT, WLS)
//        svg.selectAll(".subunit")
//                .data(subunits.features)
//                .enter().append("path")
//                .attr("class", function(d) { return "subunit " + d.id; })
//                .attr("d", pathGen);
//
//        ///


    var places = topojson.feature(uk, uk.objects.places);


    gM.selectAll("path")
        .data(topojson.feature(uk, uk.objects.subunits).features)
        .enter().append("path")
        .attr("d", path)
        .attr("class", "feature")
        .attr("class", function(d) { return "subunit " + d.id; })
        .on("click", clicked);

    gM.append("path")
        .datum(topojson.mesh(uk, uk.objects.subunits, function (a, b) {
            return a !== b;
        }))
        .attr("class", "mesh")
        .attr("d", path);

    //Add city 'dots' as a single path - From Lab
    gM.append("path")
        .datum(places)
        .attr("d", pathGen)
        .attr("class", "place");


    //Add city labels - From Lab
    gM.selectAll(".place-label")
        .data(places.features)
        .enter().append("text")
        .attr("class", "place-label")
        .attr("transform", function (d) {
            return "translate(" + projection(d.geometry.coordinates) + ")";
        })
        .attr("x", function (d) {
            return d.geometry.coordinates[0] > -1 ? 6 : -6;
        })
        .attr("dy", ".35em")
        .style("text-anchor", function (d) {
            return d.geometry.coordinates[0] > -1 ? "start" : "end";
        })
        .text(function (d) {
            return d.properties.name;});

    g.exit().remove();
});



function hideInfoPanel(){
              infoPanel.style("visibility", "hidden");

}

//function sortOrgPins(val) {
//
////    corgs = d3.selectAll("circle")
////        .data(orgs)
////        .sort(function (a, b) {
////            if (val == "grants")
////                return b.GrantsCount - a.GrantsCount;
////            else //if (val == "persons")
////                return b.PersonsCount - a.PersonsCount;
////        });
//}

function setOrgBubble(value){
//    alert(val);
//    val = value;
    d3.selectAll("circle")
        .data(orgs)
        .transition()
        .attr("r", function(d)
        {
    //        console.log(value);
            if (value == "grants")
                return Math.sqrt(parseInt(d.GrantsCount))*5||2;
    //        else if (value == "persons")
    //            return 20;
            else //if (value =="reset")
                return 3;
        })

    ;

//    d3.selectAll("circle")
//        .append("text")
//        .attr("class", "size-label")
//        .text(function (d) {
//            return "GX" + d.GrantsCount;})
//        .attr("transform", function(d)
//        {
//            return "translate(" + projection([d.Longitude, d.Latitude]) + ")";

//        });

}

//function orgPinsBy(val){
//    var g = svg.select("g");
//    var pins = g.selectAll("svg")
//        .data(orgs)
//        .selectAll("circle");
//    console.log("p:" + g);
//    console.log("X" + orgs);
//    alert(val);
//    d3.selectAll("circle")
//        .data(orgs)
//        .transition()
//        .attr("r", function(d)
//        {
//            if (val == "grants")
//                return d.GrantsCount;
//            else if (val == "persons")
//                return d.PersonsCount;
//            else if (val =="reset")
//                return 3;
//        }
//
//    //        .exit().remove();
////
////        .transition()
//////                    .sort(function(a, b) { return b - a; })
////        .attr("fill", function()
////        {
////            return "red";
////        });
//}






//function sortOrgPins2(val) {
//
//    orgs = d3.selectAll("circle")
//        .data(orgs)
//        .sort(function (a, b) {
//            if (val == "grants")
//                return b.GrantsCount - a.GrantsCount;
//            else //if (val == "persons")
//                return b.PersonsCount - a.PersonsCount;
//        });
//}

//function orgPinsBy2(val){
//if (val == "grants")
//{
//
//    d3.selectAll("circle")
//        .data(orgs)
//        .sort(function (a, b) {
//            return b.GrantsCount - a.GrantsCount;
//        })
//        .transition()
//        .attr("r", function(d)
//        {
////            if (val == "grants")
//                return d.GrantsCount;
////            else if (val == "persons")
////                return d.PersonsCount;
////            else if (val =="reset")
////                return 3;
//        });
//}
//else if (val == "persons")
//    {
//        d3.selectAll("circle")
//            .data(orgs)
//            .sort(function (a, b) {
//                return b.PersonsCount - a.PersonsCount;
//            })
//            .transition()
//            .attr("r", function(d)
//            {
////                if (val == "grants")
////                    return d.GrantsCount;
////                else if (val == "persons")
//                    return d.PersonsCount;
////                else if (val =="reset")
////                    return 3;
//            });
//    }
//
//else //if (val == "persons")
//{
//    d3.selectAll("circle")
//        .data(orgs)
//        .transition()
//        .attr("r", 3);
//}
//
//    //        .exit().remove();
////
////        .transition()
//////                    .sort(function(a, b) { return b - a; })
////        .attr("fill", function()
////        {
////            return "red";
////        });
//}




//Adapted from Zoom to Bounding Box II
function clicked(d) {
    if (active.node() === this) return reset();
    active.classed("active", false);
    active = d3.select(this).classed("active", true);

    var bounds = path.bounds(d),
        dx = bounds[1][0] - bounds[0][0],
        dy = bounds[1][1] - bounds[0][1],
        x = (bounds[0][0] + bounds[1][0]) / 2,
        y = (bounds[0][1] + bounds[1][1]) / 2,
        scale = .4,
        translate;


    thisClass = d3.event.target.className.baseVal;

//    scale = .7 / Math.max(dx / width, dy / height),
//        translate = [width / 2 - scale * x, height / 2 - scale * y];


    //adjusted to keep cameron on svg on single page layout
    if((/^subunit SCT/).test(thisClass))
    {
//        console.log("SCOTLAND");
        scale = .6 / Math.max(dx / width, dy / height);
        translate = [60,100]; //adjusted distance to keep zoom in camera

    }
    else if((/^subunit ENG/).test(thisClass))
    {
//        console.log("ENGLAND");
        scale = .5 / Math.max(dx / width, dy / height);
        translate = [-310,-450]; //adjusted distance to keep zoom in camera
    }

    else if((/^subunit WLS/).test(thisClass))
    {
//        console.log("WLS");
        scale = .4 / Math.max(dx / width, dy / height);
        translate = [-500,-1800]; //adjusted distance to keep zoom in camera
    }

    else if((/^subunit NIR/).test(thisClass))
    {
//        console.log("NIR");
        scale = .35 / Math.max(dx / width, dy / height);
        translate = [70,-890]; //adjusted distance to keep zoom in camera
    }



    svgM.transition()
        .duration(750)
        .call(zoom.translate(translate).scale(scale).event);
}

function reset() {
    active.classed("active", false);
    active = d3.select(null);

    svgM.transition()
        .duration(750)
        .call(zoom.translate([0, 0]).scale(1).event);

}

function zoomed() {
    gM.style("stroke-width", 1.5 / d3.event.scale + "px");
    gM.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}

// If the drag behavior prevents the default click,
// also stop propagation so we don’t click-to-zoom.
function stopped() {
    if (d3.event.defaultPrevented) d3.event.stopPropagation();
    hideInfoPanel();
}



//Import external Json file for grants
//        d3.json("http://www.researchperspectives.org/DV/?database=release", function(researchDB) {
function updateMap(orgs) {


    orgs
        .sort(function(a, b) //sorted for bubble map
        {
            return b.GrantsCount - a.GrantsCount;
        });

//    console.log(orgs);

    //declare variables from Json file
//    var grants = researchDB.grants;

//    var persons = researchDB.persons;
//    orgs = researchDB.organisations;



//    console.log("New O:",orgs);

    // .sort(function(a, b) { return b.properties.population - a.properties.population; }))




    //var orgs = topojson.feature(json, json.organisations);

    //debugging
//    console.log("The number of grants is " + grants.length);
//    console.log("The number of persons is " + persons.length);
//    console.log("The number of organisations is " + orgs.length);

//    console.log ("G:");
//    console.log(grants);


    val = "reset";
    var color = d3.scale.category20b();

    //Add organisation pins -  based on add labels above
    var svg = gM.selectAll("svg")
        .data(orgs)
//        .data(orgs, function(d) { return d;})
//    .sort(function(d) //////////thisthisthis
//        {
//                return a.GrantsCount - b.GrantsCount;
//        })
//                    .sort(function(a, b) { return b - a; })
        ;
    pins = svg.enter()
//        .sort(function(a, b)
//        {
//            return b.GrantsCount - a.GrantsCount;
//        })
        .append("circle")
        .attr("class", "pin")
        .style("stroke", "white")
        .style("fill", function(d,i){return color(i);})
        .style("opacity", "0.8")
        .attr("r", "3")

        //position the pin
        .attr("transform", function(d)
        {
            return "translate(" + projection([d.Longitude, d.Latitude]) + ")";
        }
    )


        //mouseover tooltip
        .on("mouseover", function(d)
        {
//          //          infoPanel.style("visibility", "hidden");


            tooltip.style("visibility", "visible")      //make visible
                .html(function(){return "<h4>" + d.Name + "</h4>";})    //send name
//                               .style("text-anchor", function() { return d.Latitude > -1 ? "start" : "end"; })
            ;
        })

        //move tooltip with mouse position
        .on("mousemove", function()
        {
            tooltip.style("top",(d3.event.pageY-5)+"px")
                .style("left",(d3.event.pageX+5)+"px");
        })

        //hide tooltip again
        .on("mouseout", function()
        {
            tooltip.style("visibility", "hidden");
        })
        .on("click", function(d)
        {
            updateTree(d);
            click(d);
//            console.log(d);
            tooltip.style("visibility", "hidden");
            infoPanel.style("visibility", "visible")      //make visible
//                .style("top",(d3.event.pageY-5)+"px")
//                .style("left",(d3.event.pageX+5)+"px")
                .html(function(){ return "<h4>" + d.Name + "</h4>" +
//                                "<ul>" +
//                                    "<li> <strong>Organisation ID :</strong> "+ d.OrgID +" </li>" +
//                                    "<li> <strong>City :</strong> "+ d.City +" </li>" +
//                                    "<li> <strong>Country :</strong> "+ d.Country +" </li>" +
//                                    "<li> <strong>Region :</strong> "+ d.Region +" </li>" +
//                                    "<li> <strong>Postcode :</strong> "+ d.Postcode +" </li>" +
//                                    "<li> <strong>Number of Grants :</strong> "+  d.GrantsCount +" </li>" +
//                                    "<li> <strong>Number of Persons :</strong> "+  d.PersonsCount +" </li>" +
////                                    "<li> <strong> :</strong> "+ d.OrgID +" </li>" +
//                                "</ul>";

                    "<dl>" +
                    "<dt>Organisation&nbsp;ID</dt> <dd>"+ d.OrgID +" </dd>" +
                    "<dt>City</dt> <dd>"+ d.City +" </dd>" +
                    "<dt>Country</dt> <dd>"+ d.Country +" </dd>" +
                    "<dt>Region</dt> <dd>"+ d.Region +" </dd>" +
                    "<dt>Postcode</dt> <dd>"+ d.Postcode +" </dd>" +
                    "<dt>Number&nbsp;of&nbsp;Grants</dt> <dd>"+ d.GrantsCount +" </dd>" +
//                    "<dt>Number&nbsp;of&nbsp;Persons</dt> <dd>"+  d.PersonsCount +" </dd>" +
//                                    "<li> <strong> :</strong> "+ d.OrgID +" </li>" +
                    "</dl>";

                })    //send name
//                               .style("text-anchor", function() { return d.Latitude > -1 ? "start" : "end"; })
            ;

        });




////                                    .on("mousemove", function(){return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})
//                    .on("mouseout", function(){return tooltip.style("visibility", "hidden")
//                    .on("mouseover", function(d) {
//                        tooltip.transition()
//                                .duration(500)
//                                .style("opacity", 0);
//                        tooltip.transition()
//                                .duration(200)
//                                .style("opacity", .9);
//                        tooltip	.html(
//                                        '<a href= "http://google.com">' + // The first <a> tag
//                                        d.Name +
//                                        "</a>" +                          // closing </a> tag
//                                        "<br/>"  + d.close)
//                                .style("left", (d3.event.pageX) + "px")
//                                .style("top", (d3.event.pageY - 28) + "px");
//                    });





    /*            var tooltip = d3.selectAll("svg")
     .data(orgs)
     .enter().append("div")
     .attr("dy", ".35em")
     .style("position", "relative")
     .style("z-index", "10")
     .style("visibility", "hidden")
     ;*/






    //Add org labels
    var tooltip =  d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden");

    var infoPanel =  d3.select("body")
            .append("div")
            .attr("class", "infoPanel")
            .style("position", "absolute")
            .style("z-index", "10")
            .style("visibility", "hidden")

        ///escape key??
//                    .on("keydown", function(key)
//                    {
//                        if (key === 27)  //esc key
//                        {
//                            tooltip.hide();
//                        }
//                    })
        ;

//    d3.selectAll("circle")
//        .data(orgs)
//        .transition()
//        .attr("r", function(d)
//        {
//            if (val == "grants")
//                return d.GrantsCount;
//            else if (val == "persons")
//                return d.PersonsCount;
//            else if (val =="reset")
//                return 3;
//        });




}


