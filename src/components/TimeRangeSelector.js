import React from 'react';
import './styles/TimeRangeSelector.css';

//buttons to swtich time range
//compoenet to render is passed from props depending if its rendering tracks or artists

export default function TimeRangeSelector({tabSwitchHandler}){
  return (
    <React.Fragment>
      <tab-container>
        <input onClick={()=>tabSwitchHandler("short_term")} type="radio" id="tabToggle01" name="tabs" value="1" defaultChecked/>
        <label htmlFor="tabToggle01">Last 4 Weeks</label>
        <input onClick={()=>tabSwitchHandler("medium_term")} type="radio" id="tabToggle02" name="tabs" value="2" />
        <label htmlFor="tabToggle02">Last 6 Months</label>
        <input onClick={()=> tabSwitchHandler("long_term")} type="radio" id="tabToggle03" name="tabs" value="3" />
        <label htmlFor="tabToggle03">Last 12 Months</label>
        
        
      </tab-container>
    </React.Fragment>
  )
}
