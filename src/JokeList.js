import React from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

class JokeList extends React.Component {

  static defaultProps = { numJokesToGet: 10 }

  constructor(props) {
    super(props);
    this.state = { jokes: [] };
    this.generateNewJokes = this.generateNewJokes.bind(this);
    this.getJokes = this.getJokes.bind(this)
    this.vote = this.vote.bind(this)
  }

  componentDidMount() {
    this.checkForJokes();
  }

  componentDidUpdate() {
    this.checkForJokes();
  }

  generateNewJokes() {
    this.setState({ jokes: [] });
    this.checkForJokes();
  }

  vote(id, delta) {
    let j = this.state.jokes.map(j => (j.id === id ? { ...j, votes: j.votes + delta } : j));
    this.setState({ jokes: j })
  };

  async getJokes() {
    let j = [...this.state.jokes];
    let seenJokes = new Set();
    try {
      while (j.length < this.props.numJokesToGet) {
        let res = await axios.get("https://icanhazdadjoke.com", {
          headers: { Accept: "application/json" }
        });
        let { status, ...jokeObj } = res.data;

        if (!seenJokes.has(jokeObj.id)) {
          seenJokes.add(jokeObj.id);
          j.push({ ...jokeObj, votes: 0 });
        } else {
          console.error("duplicate found!");
        }
      }
      this.setState({ jokes: j });
    } catch (e) {
      console.log(e);
    }

  }

  checkForJokes() {
    if (this.state.jokes.length === 0) {
      this.getJokes();
    }
  };

  render() {
    let sortedJokes = [...this.state.jokes].sort((a, b) => b.votes - a.votes);
    return (
      <div className="JokeList">
        <button className="JokeList-getmore" onClick={this.generateNewJokes}>
          Get New Jokes
      </button>

        {sortedJokes.map(j => (
          <Joke text={j.joke} key={j.id} id={j.id} votes={j.votes} vote={this.vote} />
        ))}


        {sortedJokes.length < this.props.numJokesToGet ? (
          <div className="loading">
            <i className="fas fa-6x fa-sync fa-spin" />
          </div>
        ) : null}
      </div>

    )


  }


};

export default JokeList;
