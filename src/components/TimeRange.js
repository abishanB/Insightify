//buttons to swtich time range
//also renders top songs and artists

//change how songs and artists is rendered, using props
import React from 'react';
import './styles/TimeRangeSelector.css';
import TopSongs from '../TracksPage/TopSongs'; 
import TopArtists from '../ArtistsPage/TopArtists';


export default function timeRange(props){
    return (
        <div>
        <tab-container>
            <input type="radio" id="tabToggle01" name="tabs" value="1" defaultChecked/>
            <label htmlFor="tabToggle01">Last 4 Weeks</label>
            <input type="radio" id="tabToggle02" name="tabs" value="2" />
            <label htmlFor="tabToggle02">Last 6 Months</label>
            <input type="radio" id="tabToggle03" name="tabs" value="3" />
            <label htmlFor="tabToggle03">Last 12 Months</label>
            
            <tab-content>
                {props.showTopSongs
                ?  <TopSongs tracks={props.topItems["short_term"]}/>
                :  <TopArtists artists={props.topItems["short_term"]}/>
                }
            </tab-content>
            <tab-content>
                {props.showTopSongs
                    ?  <TopSongs tracks={props.topItems["medium_term"]}/>
                    :  <TopArtists artists={props.topItems["medium_term"]}/>
                    }
            </tab-content>
            <tab-content>
                {props.showTopSongs
                    ?  <TopSongs tracks={props.topItems["long_term"]}/>
                    :  <TopArtists artists={props.topItems["long_term"]}/>
                    }
            </tab-content>
            
        </tab-container>

        </div>
      )
}
