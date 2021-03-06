import * as React from 'react';
import FullCardDownload from '../FullCardDownload';
import FullCardDropdown from '../FullCardDropdown';
import { ICardLinksOptions } from '../FullCardLinks';
import FullCardViewMore from '../FullCardViewMore';


export default (props: {options: ICardLinksOptions}) =>
    <div className="c-foot">
        <div className="c-download"><FullCardDownload downloadUrl={props.options.downloadUrl} /></div>
        <div className="c-viewmore"><FullCardViewMore serieId={props.options.serieId} collapse={props.options.collapse}/></div>
        <div className="enlaces"><FullCardDropdown options={props.options} /></div>
    </div>
