d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json", (err, data) => {
  if (err) throw error;
  const dataSet = data;
  dataSet.map(d => {
    d.Time = d.Time.split(":");
    d.Time = new Date(1970, 0, 1, 0, d.Time[0], d.Time[1]);

    //change d.time to date object
    //console.log(d.Time);
  });
  //console.log(dataSet);


  const width = 1000;
  const height = 700;
  const padding = 80;

  var tooltip = d3.select('.svgholder').append("div").
  attr("id", "tooltip");

  var canvas = d3.select(".svgholder").append('svg').
  attr("width", width).
  attr("height", height).
  style("background-color", "#d1e0e0");
  const [x, y] = d3.extent(dataSet, d => d.Year);
  console.log(x, y);

  var color = d3.scale.ordinal().
  range(["#2e405e", "#57822a"]);
  console.log(color.domain()); //it will Array[true,false]
  // d3.scaleordinal()is used in the older version for example d3.scaleOrdinal(d3.schemeCategory10)

  var xScale = d3.scale.linear().
  domain([x - 1, y + 1]) //get the min and max number of the year
  .range([padding, width - padding]);

  var xAxis = d3.svg.axis().
  scale(xScale).
  orient("bottom");
  var yScale = d3.time.scale().
  domain(d3.extent(dataSet, d => d.Time)).
  range([padding, height - padding]);
  //var timeTickFormat=d.timeFormat("%m:%S");

  timeFormat = d3.time.format("%M:%S"); //D3 3.5 use time.format instead of timeFormat( for older version),it is a function
  //console.log(timeFormat(new Date()));

  var yAxis = d3.svg.axis().
  ticks(8).
  tickFormat(timeFormat).
  scale(yScale).
  orient("left");

  function mouseOverHandler(d) {
    d3.select(this).
    style("opacity", 0.7);
    tooltip.style({
      "left": d3.event.pageX + 10 + "px",
      "top": d3.event.pageY + "px",
      "display": "block" });


  }

  function mouseOutHandler(d) {
    d3.select(this).
    style("opacity", 1);
    tooltip.style("display", "none").
    attr("data-year", d.Year).
    html("<p>" + d.Name + ":" + d.Nationality + "</br>Year:" + d.Year + ":" + "&nbsp Time:" + timeFormat(d.Time) + "</p><p>" + (d.Doping ? d.Doping : "") + "</p>");

  }
  canvas.selectAll(".dot").
  data(dataSet).
  enter().
  append("circle").
  attr("class", "dot").
  attr("cx", d => xScale(d.Year)).
  attr("cy", d => yScale(d.Time)).
  attr("r", 6).
  attr("data-xvalue", d => d.Year).
  attr("data-yvalue", d => d.Time.toISOString()) //convert the date object into a string in ISO formate(YYYY-MM-DDTHH:mm:ss:sssZ)
  .attr("fill", d => color(d.Doping != "")).
  attr("stroke", "gray").
  attr("stroke-width", 2).
  on("mouseover", mouseOverHandler).
  on("mouseout", mouseOutHandler);

  canvas.append("g").
  attr("transform", "translate(0," + (height - padding) + ")").
  attr("id", "x-axis").
  attr("class", "axis").
  call(xAxis);

  canvas.append("g").
  attr("transform", "translate(" + padding + ",0)").
  attr("id", "y-axis").
  attr("class", "axis").
  call(yAxis);

  var legend = canvas.selectAll("rect").
  data(color.domain()).
  enter();

  legend.append("rect").
  attr("id", "legend").
  attr("x", width - padding * 3).
  attr("y", (d, i) => height / 4 - 30 * i).
  attr("height", 20) //I don't know why I can not set this property in CSS, if I do, it will not work
  .attr("width", 20).
  attr("fill", d => d === true ? "#2e405e" : "#57822a");

  legend.append("text").
  attr("x", width - padding * 3 + 25).
  attr("y", (d, i) => height / 4 - 30 * i).
  text(d => d === true ? "Riders with doping allegations" : "No doping allegations").
  attr("dy", "1em"); //make the text go down 1em

  canvas.append('text').
  attr("class", "info").
  attr("x", -300).
  attr("y", 100).
  text("Time in Minutes").
  attr("transform", "rotate(-90)");


});