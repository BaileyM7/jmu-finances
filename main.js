/* 
Collaborators:
Graph 1:
Graph 2: 
Graph 3: 
Graph 4: Bailey Malota
*/ 
import * as d3 from 'd3';
import * as d3Sankey from "d3-sankey";

const width = 928;
const height = 600;
const format = d3.format(",.0f");
const linkColor = "source-target"; // source, target, source-target, or a color string.

// Create a SVG container.
const svg = d3.create("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("viewBox", [0, 0, width, height])
  .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");

// Constructs and configures a Sankey generator.
const sankey = d3Sankey.sankey()
  .nodeId(d => d.name)
  .nodeAlign(d3Sankey.sankeyJustify) // d3.sankeyLeft, etc.
  .nodeWidth(15)
  .nodePadding(10)
  .extent([[1, 5], [width - 1, height - 5]]);
//================================= my work here ===================
// gets the nodes and links for diagram 4
function forDiagram4(JMUdata) {
  const relevantData = JMUdata["jmu-athletics"];
  // prints the raw form of the data
  console.log(relevantData);

  // getting the nodes for each column
  const nodes1 = getNodes1(relevantData);
  const nodes2 = getNodes2(relevantData);
  const nodes3 = getNodes3(relevantData);
  const nodes4 = getNodes4(relevantData);
  const nodes5 = getNodes5(relevantData);


  const links = getLinks(relevantData);
  return { nodes, links };
}

// Gets the nodes for diagram 4 column 1
function getNodes1(data) {
  const result = {}; 

  // iterates though every json node
  for (const entry of data) {
    if (entry.type === "Operating Revenues") {
      // goes through every revenue
      for (const key in entry) {
        if (
          key !== "name" &&
          key !== "type" &&
          key !== "Total"
        ) {
          // adds a new key if not in the dict
          if (!result[key]) {
            result[key] = { name: key, title: "Operating Revenues", total: 0 };
          }
          // if in dict already, att to its value
          result[key].total += entry[key];
        }
      }
    }
  }
  // turns the object into an array
  console.log('column 1: ', result);
  return Object.values(result);
}

// gets the nodes for diagram 4 column 2
function getNodes2(data) {
  const result = {}; 

  // iterates though every json node
  for (const entry of data) {
    if (entry.type === "Operating Revenues") {
      // goes through every revenue
      result[entry.name] = { name: entry.name, title: entry.type, total: entry.Total };
          
    }
  }
  // turns the object into an array
  console.log('column 2: ', result);
  return Object.values(result);
}

// gets the nodes for giagram 4 columsn 3
function getNodes3(data){
  const result = {}; 
  let sum = 0;
  // iterates though every json node
  for (const entry of data) {
    if (entry.type === "Operating Revenues") {
      // goes through every revenue
      const value = Number(entry.Total);
      sum += value;

      result["JMU"] = { name: "JMU Revenue", title: entry.type, total: sum };
    }
  }
  // turns the object into an array
  console.log('column 3: ', result);
  return Object.values(result);
}

// gets the nodes for giagram 4 columsn 5
function getNodes4(data){
  const result = {}; 

  // iterates though every json node
  for (const entry of data) {
    if (entry.type === "Operating Expenses") {
      // goes through every revenue
      result[entry.name] = { name: entry.name, title: entry.type, total: entry.Total };
          
    }
  }
  // turns the object into an array
  console.log('column 4: ', result);
  return Object.values(result);
}

// gets the nodes for giagram 5 columsn 4
function getNodes5(data){
  const result = {}; 

  // iterates though every json node
  for (const entry of data) {
    if (entry.type === "Operating Expenses") {
      // goes through every revenue
      for (const key in entry) {
        if (
          key !== "name" &&
          key !== "type" &&
          key !== "Total"
        ) {
          // adds a new key if not in the dict
          if (!result[key]) {
            result[key] = { name: key, title: "Operating Expenses", total: 0 };
          }
          // if in dict already, att to its value
          result[key].total += entry[key];
        }
      }
    }
  }
  // turns the object into an array
  console.log('column 5: ', result);
  return Object.values(result);
}


// gets the links for diagram 4
function getLinks(relevantData) {

}

//================================= my work here ===================


async function init() {
  // const data = await d3.json("data/data_sankey.json");
  const JMUdata = await d3.json("data/jmu.json");
  const data = forDiagram4(JMUdata);

  // Applies it to the data. We make a copy of the nodes and links objects
  // so as to avoid mutating the original.
  const { nodes, links } = sankey({
    // const tmp = sankey({
    nodes: data.nodes.map(d => Object.assign({}, d)),
    links: data.links.map(d => Object.assign({}, d))
  });

  // console.log('tmp', tmp);
  console.log('nodes', nodes);
  console.log('links', links);

  // Defines a color scale.
  const color = d3.scaleOrdinal(d3.schemeCategory10);

  // Creates the rects that represent the nodes.
  const rect = svg.append("g")
    .attr("stroke", "#000")
    .selectAll()
    .data(nodes)
    .join("rect")
    .attr("x", d => d.x0)
    .attr("y", d => d.y0)
    .attr("height", d => d.y1 - d.y0)
    .attr("width", d => d.x1 - d.x0)
    .attr("fill", d => color(d.category));

  // Adds a title on the nodes.
  rect.append("title")
    .text(d => {
      console.log('d', d);
      return `${d.name}\n${format(d.value)}`
    });

  // Creates the paths that represent the links.
  const link = svg.append("g")
    .attr("fill", "none")
    .attr("stroke-opacity", 0.5)
    .selectAll()
    .data(links)
    .join("g")
    .style("mix-blend-mode", "multiply");

  // Creates a gradient, if necessary, for the source-target color option.
  if (linkColor === "source-target") {
    const gradient = link.append("linearGradient")
      .attr("id", d => (d.uid = `link-${d.index}`))
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", d => d.source.x1)
      .attr("x2", d => d.target.x0);
    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", d => color(d.source.category));
    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", d => color(d.target.category));
  }

  link.append("path")
    .attr("d", d3Sankey.sankeyLinkHorizontal())
    .attr("stroke", linkColor === "source-target" ? (d) => `url(#${d.uid})`
      : linkColor === "source" ? (d) => color(d.source.category)
        : linkColor === "target" ? (d) => color(d.target.category)
          : linkColor)
    .attr("stroke-width", d => Math.max(1, d.width));

  link.append("title")
    .text(d => `${d.source.name} → ${d.target.name}\n${format(d.value)}`);

  // Adds labels on the nodes.
  svg.append("g")
    .selectAll()
    .data(nodes)
    .join("text")
    .attr("x", d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
    .attr("y", d => (d.y1 + d.y0) / 2)
    .attr("dy", "0.35em")
    .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
    .text(d => d.title);

  // Adds labels on the links.
  svg.append("g")
    .selectAll()
    .data(links)
    .join("text")
    .attr("x", d => {
      console.log('linkd', d)
      const midX = (d.source.x1 + d.target.x0) / 2;
      return midX < width / 2 ? midX + 6 : midX - 6
    })
    .attr("y", d => (d.y1 + d.y0) / 2)
    .attr("dy", "0.35em")
    .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
    .text(d => {
      console.log('linkd', d);
      return `${d.source.title} → ${d.value} → ${d.target.title}`
    });

  const svgNode = svg.node();
  document.body.appendChild(svgNode);

  return svgNode;
}

init();