import * as React from 'react';

interface IBackgroundImageStyle {
    backgroundImage?: string;
}

interface IHeroProps extends React.Props<any> {
    heroImageUrl: string;
}

export default function Hero(props: IHeroProps) {

    const backgroundImageStyle: IBackgroundImageStyle = {};

    if(props.heroImageUrl !== '') {
        backgroundImageStyle.backgroundImage = `url('${props.heroImageUrl}')`;
    }

    return (
        <div id="hero" style={backgroundImageStyle}>
            <div className="hero-caption">
                <div className="container">
                    {props.children}
                </div>
            </div>
        </div>
    );

}
