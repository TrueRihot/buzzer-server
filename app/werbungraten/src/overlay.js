export function Overlay(props){
    let data= props.data;
    let points = data.map(e => e.points);
    let dataHeighest = Math.max(...points);

    const getGraphs = el => {
        let dataHeight = el.points/dataHeighest * 100 + "%";
        return(
            <div className="team-graph" style={{height: dataHeight }}>
                <div className="overlay-team">
                    {el.team}
                </div>
                <div className="overlay-points">
                    {el.points}
                </div>
            </div>
        )
    };

   
    let dataGraphs = data.map((e) => getGraphs(e));


    return (
        <>
        <div className={`overlay ${props.showOverlay ? "active" : "hidden"}`}>
            <button className="quit"onClick={ () => props.clickhandle()}>❮</button>
            <div className="auswertung">
            <h2>Auswertung</h2>

            <div className="graphs">
                {dataGraphs}
            </div>
            </div>
        </div>
        </>
    )

};