import React from 'react';
import './styles/TimeRangeSelector.css';

//buttons to swtich time range
//compoenet to render is passed from props depending if its rendering tracks or artists

export default function TimeRangeSelector({topItemsComponent}){
  return (
    <React.Fragment>
      <tab-container>
        <input type="radio" id="tabToggle01" name="tabs" value="1" defaultChecked/>
        <label htmlFor="tabToggle01">Last 4 Weeks</label>
        <input type="radio" id="tabToggle02" name="tabs" value="2" />
        <label htmlFor="tabToggle02">Last 6 Months</label>
        <input type="radio" id="tabToggle03" name="tabs" value="3" />
        <label htmlFor="tabToggle03">Last 12 Months</label>
        
        <tab-content>
          {topItemsComponent("short_term")}
        </tab-content>
        <tab-content>
          {topItemsComponent("medium_term")}
        </tab-content>
        <tab-content>
          {topItemsComponent("long_term")}
        </tab-content>
      </tab-container>
    </React.Fragment>
  )
}
