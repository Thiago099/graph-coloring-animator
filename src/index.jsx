
import './style.css'
import UseGraphGraphics from './graph-grapyics/graph-grapycs'

const {canvas,useRecord, clear, save, circle, line} = UseGraphGraphics({width: 800, height: 600})

const button = <button>Upload</button>

const video = <video controls width="800" height="600"></video>

const app =
<div class="column">
    {button}
    <div class="rpw">
        {canvas}
        {video}
    </div>
</div>
const input = <input type="file" />
button.$on("click", function() {
    input.click()
});
    


input.$on("change", function() {
    const file = this.files[0];
    const reader = new FileReader();
  
    reader.addEventListener("load", function() {
      const json = JSON.parse(reader.result);
        main(json)
    });
  
    reader.readAsText(file);
});

const colors = ['red','green', 'blue', 'yellow', 'orange', 'purple', 'pink', 'brown', 'black', 'white']
function compare(a,b)
{
    if(a.length != b.length)
        return false
    for(let i = 0; i < a.length; i++)
    {
        if(a[i] != b[i])
            return false
    }
    return true
}
async function main(data)
{

    let color_ids = data.colorHistory[0].map(() => 0)
    var prev = [...color_ids]
    data.colorHistory.push(data.colorHistory[data.colorHistory.length-1])
    data.selected.push(-1)

    const {stop} = useRecord()
    for(const c in data.colorHistory)
    {
        const selected = data.selected[c]
        prev = [...color_ids]
        await draw()
        color_ids = data.colorHistory[c]
        if(!compare(prev, color_ids))
        await draw()
        async function draw()
        {
            clear()
            for(const connection of data.connections)
            {
                var {x:x1,y:y1} = data.nodes[connection.from]
                var {x:x2,y:y2} = data.nodes[connection.to]

                if(connection.from == selected || connection.to == selected)
                {
                    line({
                        x1:x1,
                        y1:y1,
                        x2:x2,
                        y2:y2,
                        color: 'cyan',
                        width: 5
                    })
                }
                else
                {
                    line({
                        x1:x1,
                        y1:y1,
                        x2:x2,
                        y2:y2,
                        color: 'white',
                        width: 2
                    })
                }
            }
            for(const node in data.nodes)
            {
                const {x,y} = data.nodes[node]
        
                if(node == selected)
                {
                    circle({
                        x:x,
                        y:y,
                        r:14, 
                        border: {
                            color: 'cyan',
                            width: 5
                        },
                        color: 'white'
                    })
                }
                else
                {
                    if(prev[node] == color_ids[node])
                    {
                        circle({
                            x:x,
                            y:y,
                            r:14, 
                            border: {
                                color: 'white',
                                width: 2
                            },
                            color: colors[color_ids[node]]
                        })
                    }
                    else
                    {
                        circle({
                            x:x,
                            y:y,
                            r:20, 
                            border: {
                                color: 'white',
                                width: 2
                            },
                            color: colors[color_ids[node]]
                        })
                    }
                }
            }
            // save()
            await new Promise(resolve => setTimeout(resolve, 500))

        }
    }
    await new Promise(resolve => setTimeout(resolve, 1000))
    stop()
    .then(url => {
        video.src = url
    })
}



app.$parent(document.body)