import * as React from 'react'

export class Message extends React.Component {

    constructor(props, context) {
        super(props, context);
    }

    render() {
      return(
        <div>
        {this.props.show &&
          <div className="popin">
            <div className="message" dangerouslySetInnerHTML={this.props.message}>

            </div>
          </div>
        }
      </div>
      );
  }

};

Message.defaultProps = {
    show: false
};
