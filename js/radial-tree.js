//radial-tree.js
// Author: Khaleeq Ahmad     Date: November 2014
//Creates a collapsible tree in D3 using the update pattern, using hierchial data based on the Research Perspectives db. The tree consists of nodes which can be expanded to view children on the same branch. Clicking another node closes all other branches. Hovering over a node shows tooltips with relevant information on an organisation/grant/investigator.
//Based on Bostock's Examples - Collapisble Tree (http://bl.ocks.org/mbostock/4339083), adapted with elements from the Radial Reingold–Tilford Tree (http://bl.ocks.org/mbostock/4063550) for the circular shape and rotations
var width = 1300,
height = 1600;

var i = 0,
duration = 750,
root;

var diameter = width;


var tree = d3.layout.tree()
.size([360, diameter / 2 - 300])
.separation(function(a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; });


var diagonal = d3.svg.diagonal.radial()
.projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });

var svg = d3.select("body").append("svg")
    .attr("id", "radial-tree")
.attr("width", width)
.attr("height", height)
.append("g")
//.attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")")
        .attr("transform", function(d) { return "translate(" + diameter / 2 + "," + diameter / 2 + ") rotate(" + (0) + ")"; })
    ;


    d3.select(self.frameElement).style("height", "800px");


function plantTree(rt){
    root = rt;

    root.x0 = height / 2;
    root.y0 = 0;

    root.children.forEach(collapse);
    updateTree(root);
}

    function updateTree(source) {
//        var cleanArray = [];
//        for(var i = 0; i < source.length; i++)
//        {
//            x = source[i];
//            if(x.length >0) {
////                cleanArray.push(source[i]);
//                console.log(i);
//            }
//        }

//        console.log(source);
//        console.log(cleanArray);

//    && d._children.length > 0

//        console.log(source);

        // Compute the new tree layout.
        var nodes = tree.nodes(root).reverse(), //all nodes
            links = tree.links(nodes);          //paths between nodes

        // Normalize for fixed-depth.
        nodes.forEach(function(d) { d.y = d.depth * 200; });

        // Update the nodes…
        var node = svg.selectAll("g.node")
                .data(nodes, function(d) { return d.id || (d.id = ++i); })
                        .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })            ;
//        var node = svg.selectAll(".node")
//                .data(nodes)
//                .enter().append("g")
//                .attr("class", "node")


// Enter any new nodes at the parent's previous position.
        var nodeEnter = node.enter().append("g")
                .attr("class", "node")
                .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })
                .on("click", click)


            .on("mouseover", function(d)
            {
                tooltipFull.style("visibility", "hidden");
                tooltipFull.style("visibility", "visible")      //make visible
//                    .html(function(){return "<h4>" + d.Name + "</h4>";})
                    .html(function() {
                        //title
                        title = "<h4>" + ( d.hasOwnProperty("Name") ?  d.Name : ( d.hasOwnProperty("Title") ?  d.Title +  "<br/>" + "<b>(£" + d.Value + ")</b>" : d.ID)) +"</h4>";
                        return  title + "<dl>" +


                            // show fields on tooltip
                            ( d.hasOwnProperty("ID") ? "<dt>ID</dt> <dd>" + d.ID + " </dd>" : " ") + "" +
                            ( d.hasOwnProperty("OrgID") ? "<dt>Organsation&nbsp;ID</dt> <dd>" + d.OrgID + " </dd>" : "") + "" +
                            ( d.hasOwnProperty("Role") ? "<dt>Role</dt> <dd>" + d.Role + " </dd>" : "") + "" +
                            ( d.hasOwnProperty("Scheme") ? "<dt>Scheme</dt> <dd>" + d.Scheme + " </dd>" : "") + "" +
                            ( d.hasOwnProperty("EndDate") ? "<dt>End&nbsp;Date</dt> <dd>" + d.EndDate + " </dd>" : "") + "" +
                            ( d.hasOwnProperty("Value") ? "<dt>Value</dt> <dd>" + "£" + d.Value + " </dd>" : "") + "" +
                            ( d.hasOwnProperty("StartDate") ? "<dt>Start&nbsp;Date</dt> <dd>" + d.StartDate + " </dd>" : "") + "" +
                            ( d.hasOwnProperty("ResearchArea") ? "<dt>Research&nbsp;Area</dt> <dd>" + d.ResearchArea + " </dd>" : "") + "" +
                            ( d.hasOwnProperty("Theme") ? "<dt>Theme</dt> <dd>" + d.Theme + " </dd>" : "") + "" +
                            ( d.hasOwnProperty("Summary") ? "<dt>Summary</dt> <dd>" + d.Summary + " </dd>" : "") + "" +
                            ( d.hasOwnProperty("Department") ? "<dt>Department</dt> <dd>" + d.Department + " </dd>" : "") + "" +
                            ( d.hasOwnProperty("City") ? "<dt>City</dt> <dd>" + d.City + " </dd>" : "") + "" +
                            ( d.hasOwnProperty("Country") ? "<dt>Country</dt> <dd>" + d.Country + " </dd>" : "") + "" +
                            ( d.hasOwnProperty("Region") ? "<dt>Region</dt> <dd>" + d.Region + " </dd>" : "") + "" +
                            ( d.hasOwnProperty("Postcode") ? "<dt>Postcode</dt> <dd>" + d.Postcode + " </dd>" : "") + "" +
                            ( d.hasOwnProperty("GrantsCount") ? "<dt>Number&nbsp;of&nbsp;Grants</dt> <dd>" + d.GrantsCount + " </dd>" : "") + "" +

                            "</dl>";
                    });
            })

            //move tooltip with mouse position
            .on("mousemove", function()
            {

                tooltipFull.style("top",(d3.event.pageY-5)+"px")
                            .style("left",(d3.event.pageX+5)+"px");
            })

            //hide tooltip again
            .on("mouseout", function()
            {
                tooltipFull.style("visibility", "hidden");
            })

            //on click run click function (expand node) + make sure tooltip is hidden
            .on("click", function(d)
            {
                click(d);
                tooltipFull.style("visibility", "hidden")
            });



        nodeEnter.append("circle")
                .attr("r", 1e-6)
                .style("fill", function(d) { return d._children ? "#4682b4" : "#d71038"; });


        //append text to nodes
        nodeEnter.append("text")
            .attr("class", "node-text")
                .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
                .attr("dy", ".35em")
                .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
                .attr("dy", ".31em")
                .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
                .attr("transform", function(d) { return d.x < 180 ? "translate(20)" : "rotate(180)translate(0)"; })
                .text(function(d) {
                    if (d.depth < 2) //Only Root and Orgs will be labeled by name
                        return d.Name;
                    else if (d.depth == 2)
                    {
                        return d.ID + " " + "(£" + d.Value + ")"; //Grants labeled by ID and Value for space. Full details on tooltip
                    }
                    else
                        return ""; //subnodes blank for space, full details on tooltips
                })
//                .text(function(d) { return d.Title; })
                .style("fill-opacity", 1e-6);

        // Transition nodes to their new position.
        var nodeUpdate = node.transition()
                .duration(duration)
                .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; });

        nodeUpdate.select("circle")
                .attr("r", 3.5)
                .style("fill", function(d) { return d._children && d._children.length > 0 ? "#4682b4" : "#d71038"; }) //custom colours
//                .style("fill", function(d) { return d._children !== [null] ? "#4682b4" : "#d71038"; })

        ;


        nodeUpdate.select("text")
                .style("fill-opacity", 1);

        // Transition exiting nodes to the parent's new position.
var nodeExit = node.exit().transition()
.duration(duration)
.attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
.remove();

nodeExit.select("circle")
                .attr("r", 1e-6);

        nodeExit.select("text")
                .style("fill-opacity", 1e-6);

        // Update the links…
        var link = svg.selectAll("path.link")
                .data(links, function(d) { return d.target.id; });
//        var link = svg.selectAll(".link")
//                .data(links)
//                .enter().append("path")
//                .attr("class", "link")
//                .attr("d", diagonal);

        // Enter any new links at the parent's previous position.
        link.enter().insert("path", "g")
                .attr("class", "link")
                .attr("d", function(d) {
                    var o = {x: source.x0, y: source.y0};
                    return diagonal({source: o, target: o});
                });

        // Transition links to their new position.
        link.transition()
                .duration(duration)
                .attr("d", diagonal);

        // Transition exiting nodes to the parent's new position.
        link.exit().transition()
                .duration(duration)
                .attr("d", function(d) {
                    var o = {x: source.x, y: source.y};
                    return diagonal({source: o, target: o});
                })
                .remove();

        // Stash the old positions for transition.
        nodes.forEach(function(d) {
            d.x0 = d.x;
            d.y0 = d.y;
        });



        //declare the tooltip
        var tooltipFull =  d3.select("body")
                .append("div")
                .attr("class", "tooltipFull")
                .style("visibility", "hidden")
//                    .on("keydown", function(key)
//                    {
//                        if (key === 27)  //esc key
//                        {
//                            tooltip.hide();
//                        }
//                    })
            ;



    }

    // Toggle children on click.
    function click(d) {
        if (d.children) {
            d._children = d.children;
            d.children = null;
        } else {
            d.children = d._children;
            d._children = null;
        }

        // Collapse sibling/uncle branches except for clicked node.
        if (d.parent) {
            d.parent.children.forEach(function(element) {
                if (d !== element) {
                    collapse(element);
                }
            });
        }

        updateTree(d);
    }

    function collapse(d) {
        if (d.children) {
            d._children = d.children;
            d._children.forEach(collapse);
            d.children = null;
        }
    }

//    d3.select(self.frameElement).style("height", diameter - 150 + "px");
