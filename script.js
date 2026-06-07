const pos = {

A:[100,100],
B:[100,350],
C:[350,100],
D:[200,570],
E:[370,350],
F:[580,190],
G:[470,590],
H:[620,430],
I:[810,100],
J:[810,570],
K:[880,300],
L:[1040,480]

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

    return list.some(
        x =>
        (x[0]==a&&x[1]==b) ||
        (x[0]==b&&x[1]==a)
    );

}

function cost(a,b){

    let base = roads[a][b];

    let slope =
    Number(document.getElementById("slope").value);

    let stair =
    Number(document.getElementById("stairs").value);

    let narrowW =
    Number(document.getElementById("narrow").value);

    let p = 0;

    if(hasFeature(a,b,slopes))
        p += slope/10;

    if(hasFeature(a,b,stairs))
        p += stair/10;

    if(hasFeature(a,b,narrow))
        p += narrowW/10;

    return base+p;
}

function dijkstra(start,end){

    let dist={};
    let prev={};
    let unvisited=[];

    Object.keys(roads).forEach(n=>{

        dist[n]=Infinity;
        unvisited.push(n);

    });

    dist[start]=0;

    while(unvisited.length){

        unvisited.sort(
            (a,b)=>dist[a]-dist[b]
        );

        let cur=unvisited.shift();

        if(cur===end) break;

        for(let nxt in roads[cur]){

            let nd =
            dist[cur]
            + cost(cur,nxt);

            if(nd<dist[nxt]){

                dist[nxt]=nd;
                prev[nxt]=cur;

            }
        }
    }

    let path=[];
    let cur=end;

    while(cur){

        path.unshift(cur);
        cur=prev[cur];

    }

    return path;
}

const canvas =
document.getElementById("mapCanvas");

const ctx =
canvas.getContext("2d");

function draw(path=[]){

    ctx.clearRect(
        0,0,
        canvas.width,
        canvas.height
    );

    for(let node in roads){

        for(let nxt in roads[node]){

            let [x1,y1]=pos[node];
            let [x2,y2]=pos[nxt];

            ctx.beginPath();
            ctx.moveTo(x1,y1);
            ctx.lineTo(x2,y2);
            ctx.stroke();

        }
    }

    ctx.strokeStyle="red";
    ctx.lineWidth=6;

    for(let i=0;i<path.length-1;i++){

        let [x1,y1]=pos[path[i]];
        let [x2,y2]=pos[path[i+1]];

        ctx.beginPath();
        ctx.moveTo(x1,y1);
        ctx.lineTo(x2,y2);
        ctx.stroke();

    }

    ctx.lineWidth=1;
    ctx.strokeStyle="black";

    for(let node in pos){

        let [x,y]=pos[node];

        ctx.beginPath();
        ctx.arc(x,y,35,0,Math.PI*2);
        ctx.stroke();

        ctx.font="20px Arial";
        ctx.fillText(node,x-7,y+7);

    }
}

function calculatePath(){

    let start =
    document.getElementById("start").value;

    let end =
    document.getElementById("end").value;

    let path =
    dijkstra(start,end);

    draw(path);

    document.getElementById(
        "result"
    ).innerText=
    path.join(" → ");
}

Object.keys(pos).forEach(n=>{

    start.innerHTML+=
    `<option>${n}</option>`;

    end.innerHTML+=
    `<option>${n}</option>`;

});

["slope","stairs","narrow"]
.forEach(id=>{

    document.getElementById(id)
    .addEventListener(
        "input",
        ()=>{
            document.getElementById(
                id+"Val"
            ).innerText=
            document.getElementById(id).value;

            calculatePath();
        }
    );

});

draw();
