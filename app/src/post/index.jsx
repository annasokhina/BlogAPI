import React from 'react';
import {Link} from 'react-router-dom';
import queryString from 'query-string';
import './index.less';

class Post extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			post: {},
			showMessage: false,
			textMessage: 'Post successfully deleted!',
			key: ''
		};
		this.deletePost = this.deletePost.bind(this);
	}

	componentDidMount() {
		const id = this.props.match.params.id;
		const searchParams = this.props.location.search;
		const parsedSearchParams = queryString.parse(searchParams);
		const keyParam = parsedSearchParams.key ? parsedSearchParams.key : '';
		this.setState({ key: keyParam });

		fetch(`/api/posts/${id}?key=${parsedSearchParams.key}`, {method: 'get'})
			.then(result => result.json())
			.then(result => {
				if (result.error) {
					console.error(result.error);
					return;
				}
				if (result.id) {
					this.setState({ post: result });
				}
			});
	}

	showMessage() {
		this.setState({ showMessage: true });
		setTimeout(() => {
			this.setState({ showMessage: false });
			this.props.history.push(`/?key=${this.state.key}`);
		}, 2500);
	}

	deletePost() {
		const id = this.props.match.params.id;
		fetch(`/api/posts/${id}?key=${this.state.key}`, {method: 'delete'})
			.then((result) => {
				return result.json();
			})
			.then((result) => {
				if (result.message) {
					this.setState({ post: {} });
					this.showMessage();
				}
				if (result.error) {
					console.error(result.error);
				}
			});
	}

	render() {
		const post = this.state.post;

		const {showMessage, textMessage} = this.state;
		const messageText = showMessage
			? <div className="message-block success">{textMessage}</div>
			: '';

		const postData = (post && post.id) ?
					<div>
						<h1>{post.title}</h1>
						<h2 className="post-categories">Categories: {post.categories}</h2>
						<p className="post-content">{post.content}</p>
					</div>
					: '';

		return (
			<div className="block-wrapper">
				{postData}
				{messageText}
				<div className="buttons">
						<Link className="btn" to={`/?key=${this.state.key}`}>
							Back
						</Link>
						<button className="btn delete"
							onClick={this.deletePost}>Delete</button>
				</div>
			</div>
		);
	}
}

export default Post;
