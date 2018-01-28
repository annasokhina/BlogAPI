import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import './index.less';
import PostsBlock from './posts-block/index.jsx';
import NewPost from './new-post/index.jsx';
import Post from './post/index.jsx';

class App extends React.Component {
	render() {

		return (
			<div className="container">
				{this.props.children}
			</div>
		);
	}
}

const NoMatch = (props) => (<h1>Page not found: {props.location.pathname}</h1>);

const MainRouter = () => (
	<Router>
		<App>
			<Switch>
				<Route exact path="/" component={PostsBlock} />
				<Route exact path="/post/:id" component={Post} />
				<Route exact path="/new-post" component={NewPost} />
				<Route component={NoMatch}/>
			</Switch>
		</App>
	</Router>
);

ReactDOM.render(<MainRouter/>, document.getElementById('root'));
