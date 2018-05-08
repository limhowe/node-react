import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { Button, Form, Grid, Header, Segment } from 'semantic-ui-react';
import { forgotRequest } from '../redux/actions';

import './style.scss';

class ForgotPage extends Component {
    constructor (props) {
        super(props);

        this.state = {
            email: ''
        };
    }

    onChange = (field) => (evt) => {
        this.setState({ [field]: evt.target.value });
    }

    onSubmit = () => {
        const { email } = this.state;
        this.props.forgotRequest(email);
    }

    render () {
        const { email } = this.state;
        return (
          <Grid
            textAlign="center"
            className="page-login"
            verticalAlign="middle"
          >
            <Grid.Column className="column-login" onSubmit={this.onSubmit}>
              <Header as="h2" color="blue" textAlign="center">
            Forgot Password
          </Header>
              <Form size="large">
                <Segment stacked>
                  <Form.Input
                    fluid
                    value={email}
                    onChange={this.onChange('email')}
                    icon="user"
                    iconPosition="left"
                    placeholder="E-mail address"
                  />
                  <Button primary fluid size="large">Reset Password</Button>
                  <Link to="/signup" className="signup-link">Click here to sign up</Link>
                </Segment>
              </Form>
            </Grid.Column>
          </Grid>
        );
    }
}

const mapStateToProps = createStructuredSelector({
});

const mapDispatchToProps = {
    forgotRequest
};

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(ForgotPage);
