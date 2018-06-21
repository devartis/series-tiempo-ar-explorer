import * as React from "react";

import ISelectorProps from "./SelectorProps";


class Selector<T> extends React.Component<ISelectorProps<T>, any> {

    constructor(props: ISelectorProps<T>) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
        this.toRadioButton = this.toRadioButton.bind(this);
    }

    public handleClick(item: T) {
        return (event: React.SyntheticEvent<HTMLAnchorElement>) => {
            this.props.onItemSelected(
                event,
                item
            );
        };
    }

    public render() {
        return (
            <ul>
                {this.props.items.map(this.toRadioButton)}
            </ul>
        );
    }

    public toRadioButton(item: T) {
        return (
            <li key={item.toString()}>
                <a onClick={this.handleClick(item)}>
                    <label>
                        {this.props.renderItem(item)}
                    </label>
                </a>
            </li>
        );
    }
}

export default Selector;