import React from 'react';

import TitlePreview from '../../comps/TitlePreview/TitlePreview.js';
import HorizontalScrollable from '../HorizontalScrollable/HorizontalScrollable.js';

class List extends React.Component {

    render(){
        return <>
            <div class="row">
                <div class="col">
                    <h3 class="pb-2">{this.props.name}</h3>
                    <HorizontalScrollable>
                        <div class="row g-3">
                            {this.props.titles.map(t => <>
                                <TitlePreview title={t} />
                            </>)}
                        </div>
                    </HorizontalScrollable>
                </div>
            </div>
        </>
    }

}

export default List;