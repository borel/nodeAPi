// Data defaut for graph
var data = {
    labels: [
            ],
    datasets: [
        {
            fillColor: "rgba(220,220,220,0.5)",
            strokeColor: "rgba(220,220,220,0.8)",
            highlightFill: "rgba(220,220,220,0.75)",
            highlightStroke: "rgba(220,220,220,1)",
            data: []
        },
    ]
};

function updateGraph(name,tk){
  window.myBar.addData([tk, tk], "1k");
  window.myBar.update();
}
