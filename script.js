const pos = {

A:[99,88],
B:[100,349],
C:[356,85],
D:[199,569],
E:[369,349],
F:[585,190],
G:[468,589],
H:[624,429],
I:[809,85],
J:[809,569],
K:[876,294],
L:[1036,480]

};

const roads = {

A:{B:4,C:5,E:6},
B:{A:4,D:3,E:4},
C:{A:5,E:4,F:2},
D:{B:3,E:5,G:4},
E:{A:6,B:4,C:4,D:5,F:5,G:7,H:4},
F:{C:2,E:5,H:2,I:4},
G:{D:4,E:7,H:3,J:5},
H:{E:4,F:2,G:3,J:3,K:7},
I:{F:4,K:6},
J:{G:5,H:3,K:4,L:6},
K:{I:6,J:4,H:7,L:3},
L:{J:6,K:3}

};

const slopes = [
["A","E"],
["F","I"],
["G","H"],
["H","J"]
];

const stairs = [
["A","E"],
["B","D"],
["F","H"],
["H","J"]
];

const narrow = [
["A","E"],
["C","E"],
["E","H"],
["I","K"],
["K","L"]
];

function hasFeature(a,b,list){

    return list.some(x =>
        (x[0]===a && x[1]===b) ||
        (x[0]===b && x[1]===a)
    );
}

function cost(a,b){

    const base = roads[a][b];

    const slope =
    Number(document.getElementById("slope").value);

    const stair =
    Number(document.getElementById("stairs").value);

    const narrowW =
    Number(document.getElementById("narrow").value);

    let p = 0;

    if(hasFeature(a,b,slopes))
        p += slope/10;

    if(hasFeature(a,b,stairs))
        p += stair/10;

    if(hasFeature(a,b,narrow))
        p += narrowW/10;

    return base + p;
}

function dijkstra(start,end){

    const dist = {};
    const prev = {};
    const unvisited = [];

    Object.keys(roads).forEach(node=>{

        dist[node]=Infinity;
        unvisited.push(node);

    });

    dist[start]=0;

    while(unvisited.length){

        unvisited.sort(
            (a,b)=>dist[a]-dist[b]
        );

        const cur = unvisited.shift();

        if(cur===end)
            break;

        for(const nxt in roads[cur]){

            const nd =
            dist[cur]
            + cost(cur,nxt);

            if(nd<dist[nxt]){

                dist[nxt]=nd;
                prev[nxt]=cur;

            }
        }
    }

    const path=[];

    let cur=end;

    while(cur){

        path.unshift(cur);
        cur=prev[cur];

    }

    return path;
}

function drawPath(path){

    const svg =
    document.getElementById("overlay");

    svg.innerHTML="";

    for(let i=0;i<path.length-1;i++){

        const [x1,y1] =
        pos[path[i]];

        const [x2,y2] =
        pos[path[i+1]];

        const line =
        document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line");

        line.setAttribute("x1",x1);
        line.setAttribute("y1",y1);
        line.setAttribute("x2",x2);
        line.setAttribute("y2",y2);

        line.setAttribute("stroke","red");
        line.setAttribute("stroke-width","8");
        line.setAttribute("stroke-linecap","round");

        svg.appendChild(line);
    }

    const startCircle =
    document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle");

    const [sx,sy]=pos[path[0]];

    startCircle.setAttribute("cx",sx);
    startCircle.setAttribute("cy",sy);
    startCircle.setAttribute("r","18");
    startCircle.setAttribute("fill","lime");

    svg.appendChild(startCircle);

    const endCircle =
    document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle");

    const [ex,ey]=
    pos[path[path.length-1]];

    endCircle.setAttribute("cx",ex);
    endCircle.setAttribute("cy",ey);
    endCircle.setAttribute("r","18");
    endCircle.setAttribute("fill","blue");

    svg.appendChild(endCircle);
}

function calculatePath(){

    const start =
    document.getElementById("start").value;

    const end =
    document.getElementById("end").value;

    const path =
    dijkstra(start,end);

    drawPath(path);

    document.getElementById(
    "result").innerHTML =
    "추천 경로<br><br>" +
    path.join(" → ");
}

Object.keys(pos).forEach(node=>{

    document.getElementById("start")
    .innerHTML +=
    `<option>${node}</option>`;

    document.getElementById("end")
    .innerHTML +=
    `<option>${node}</option>`;

});

document.getElementById("end").value="L";

["slope","stairs","narrow",
"start","end"]
.forEach(id=>{

    document.getElementById(id)
    .addEventListener(
        "input",
        calculatePath
    );

});

calculatePath();
