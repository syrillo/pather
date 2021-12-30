import React, {useState, useEffect} from 'react';
import './Header.css';
import visualizeDijkstra from '../PathfindingVisualizer/PathfindingVisualizer';

function Header() {
    // const [click, setClick] = useState(true);

    // useEffect(() => {
    //     visualizeDijkstra();
    // },[click])

    return(
        <>
            <h4 className="header">
                {/* <button onClick={() => setClick(prev => !prev)}>Visualize</button> */}
            </h4>
        </>
    );

}

export default Header;