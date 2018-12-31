import React from 'react';

class TransitionListItem extends React.Component {
  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    const { transition } = this.props;

    this.props.onClick(transition);
  }

  render() {
    const { transition, styles } = this.props;

    return (
      <li style={styles} onClick={this.onClick}>
        { transition.name }
      </li>
    )
  }
};

export default TransitionListItem;
