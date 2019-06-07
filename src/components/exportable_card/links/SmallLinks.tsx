import * as React from 'react';
import FullCardDropdown from '../FullCardDropdown';
import { ICardLinksOptions } from '../FullCardLinks';


export default (props: {options: ICardLinksOptions}) =>
    <div className="c-foot">
        <div><FullCardDropdown options={props.options} /></div>
    </div>
