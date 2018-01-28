import React from 'react';
import { Link } from 'react-router-dom';
import './index.less';
import queryString from 'query-string';

class NewPost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      categories: '',
      content: '',
      showMessage: false,
      errorMessage: 'Please fill in all the fields of the form',
      successMessage: 'New post successfully added',
      messageText: '',
      key: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.sendNewPost = this.sendNewPost.bind(this);
  }

  componentDidMount() {
    const searchParams = this.props.location.search;
    const parsedSearchParams = queryString.parse(searchParams);
    const keyParam = parsedSearchParams.key ? parsedSearchParams.key : '';
    this.setState({
      key: keyParam
    });
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  showMessage(messageText) {
    this.setState({
      showMessage: true,
      messageText
    });
    setTimeout(() => {
      this.setState({ showMessage: false });
      if (messageText === 'successMessage') {
        this.props.history.push(`/?key=${this.state.key}`);
      }
    }, 2500);
  }

  sendNewPost() {
    const { title, categories, content } = this.state;
    if (title.length === 0 || categories.length === 0 || content.length === 0) {
      this.showMessage('errorMessage');
      return;
    }
    const data = {
      title,
      categories,
      content
    };
    fetch(`/api/posts?key=${this.state.key}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then((result) => result.json())
      .then((result) => {
        if (result.error) {
          console.log(result.error);
          return;
        }
        if (result.id) {
          this.setState({
            title: '',
            categories: '',
            content: ''
          });
          this.showMessage('successMessage');
        }
      });
  }

  render() {
    const { messageText, showMessage } = this.state;
    const textMessage = showMessage ?
      <div
    className = { `message-block ${(messageText === 'errorMessage' ? 'error' : 'success')}` } > { this.state[messageText] } < /div>: '';
    return ( <form
       action = "#"
      className = "block-wrapper"
      onSubmit = {
        (e) => e.preventDefault()
      } >
      <label> Title </label>
      <input name = "title"
      maxLength = "90"
      onChange = { this.handleChange } value = { this.state.title }
      />
      <label> Categories </label>
      <input name = "categories"
      maxLength = "90"
      onChange = { this.handleChange } value = { this.state.categories }
      />
      <label> Content </label>
      <textarea name = "content"
      onChange = { this.handleChange } value = { this.state.content }
      /> { textMessage }
      <div className = "buttons" >
      <button className = "btn submit"
      onClick = { this.sendNewPost } >
      Submit
      </button>
      <Link className = "btn cancel"
      to = { `/?key=${this.state.key}` } >
      Cancel
      </Link>
      </div>
      </form>
    );
  }
}

export default NewPost;
