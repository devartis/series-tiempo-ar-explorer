import * as React from "react";
import {ISerie} from "../../api/Serie";
import ShareContainer from "../style/Share/ShareContainer";
import SocialNetworkShareContainer from "../style/Share/SocialNetworkShareContainer";
import ShareDropdown from "./share/ShareDropdown";
import {TwitterShare} from "./share/TwitterShare";

export interface IShareProps {
    url: string;
    series: ISerie[]
}

export default (props: IShareProps) =>
    <ShareContainer>
        <ShareDropdown url={props.url} series={props.series} />
        <SocialNetworkShareContainer>
            <TwitterShare series={props.series} />
        </SocialNetworkShareContainer>
    </ShareContainer>
