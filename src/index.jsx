
import './style.css'
import UseGraphGraphics from './graph-grapyics/graph-grapycs'

const {canvas, clear, save, circle, line} = UseGraphGraphics({width: 800, height: 600})

const app =
<div class="column">
    <button on:click={save}>Save</button>
    {canvas}
</div>


const colors = ['green', 'blue', 'yellow', 'orange', 'purple', 'pink', 'brown', 'black', 'white']

main()
async function main()
{

    const sim = await fetch('./sim.json').then(response => response.json())
    const model = await fetch('./model.json').then(response => response.json())
    let color_ids = sim.graphs[0].map(() => 0)
    for(const c in sim.graphs)
    {
        const selected = sim.nodes[c]
        draw()
        color_ids = sim.graphs[c]
        draw()
        function draw()
        {
            clear()
            for(const connection of model.connections)
            {
                var {x:x1,y:y1} = model.nodes[connection.from]
                var {x:x2,y:y2} = model.nodes[connection.to]
                line({
                    x1:x1,
                    y1:y1,
                    x2:x2,
                    y2:y2,
                    color: 'black',
                    width: 2
                })
            }
            for(const node in model.nodes)
            {
                const {x,y} = model.nodes[node]
        
                if(node == selected)
                {
                    circle({
                        x:x,
                        y:y,
                        r:14, 
                        border: {
                            color: 'red',
                            width: 5
                        },
                        color: 'black'
                    })
                }
                else
                {
                    circle({
                        x:x,
                        y:y,
                        r:14, 
                        border: {
                            color: 'black',
                            width: 2
                        },
                        color: colors[color_ids[node]]
                    })
                }
            }
            save()
        }
    }
}



app.$parent(document.body)