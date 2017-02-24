import React, { Component } from 'react';
import moment from 'moment';
import { map, findIndex, find, sortBy } from 'lodash';
import { Motion, spring } from 'react-motion';
import keypress from 'react-keypress';
import './styles.css';

/**
* @method: guid
* @desc: Generates unique guid
**/
function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

function reinsert(todos, todo, to) {
  const fromPos = todo.pos;
  const swapTodo = find(todos, {
    pos: to
  });
  map(todos, (t) => {
    if (t.id === todo.id) {
      t.pos = to;
    } else if (swapTodo.id === t.id) {
      t.pos = fromPos;
    }
  });
  // const sortedTodos = sortBy(todos, 'pos');
  return todos;
}

function clamp(n, min, max) {
  return Math.max(Math.min(n, max), min);
}

const springConfig = { stiffness: 300, damping: 50 };

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      topDeltaY: 0,
      mouseY: 0,
      isPressed: false,
      originalPosOfLastPressed: 0,
      order: [],
      todos: []
    };
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.addTodo = this.addTodo.bind(this);
    this.completeTodo = this.completeTodo.bind(this);
  }
  componentDidMount() {
    window.addEventListener('touchmove', this.handleTouchMove);
    window.addEventListener('touchend', this.handleMouseUp);
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('mouseup', this.handleMouseUp);
  }

  componentWillReceiveProps(nextProps) {
  }

  handleTouchStart(key, pressLocation, e) {
    this.handleMouseDown(key, pressLocation, e.touches[0]);
  }

  handleTouchMove(e) {
    e.preventDefault();
    this.handleMouseMove(e.touches[0]);
  }

  handleMouseDown(pos, pressY, { pageY }) {
    this.setState({
      topDeltaY: pageY - pressY,
      mouseY: pressY,
      isPressed: true,
      originalPosOfLastPressed: pos
    });
  }

  handleMouseMove({ pageY }) {
    const { isPressed, topDeltaY, originalPosOfLastPressed } = this.state;
    const order = this.state.todos;
    if (isPressed) {
      const mouseY = pageY - topDeltaY;
      const currentRow = clamp(Math.round(mouseY / 50), 0, this.state.todos.length - 1);
      let newOrder = order;
      console.log(currentRow, findIndex(order, {
        pos: originalPosOfLastPressed
      }))
      if (currentRow !== findIndex(order, {
        pos: originalPosOfLastPressed
      })) {
        newOrder = reinsert(this.state.todos, find(this.state.todos, {
          pos: originalPosOfLastPressed
        }), currentRow);
        console.log('NEW ORDER--->', newOrder)
      }
      this.setState({ mouseY, todos: newOrder });
    }
  }
  handleMouseUp() {
    const sortedTodos = sortBy(this.state.todos, 'pos');
    this.setState({ isPressed: false, topDeltaY: 0, todos: sortedTodos });
  }
  addTodo(event) {
    if (event.target.value === '') return;
    const todos = this.state.todos;
    const pos = this.state.todos.length;
    todos.push({
      id: guid(),
      pos,
      text: event.target.value,
      timestamp: '',
      isDraggable: true,
      isCompleted: false
    });
    this.setState({
      todos
    });
    event.target.value = '';
  }
  deleteTodo() {
    //
  }
  updateTodo() {
    //
  }
  completeTodo(value, pos) {
    console.log(value, pos);
  }
  render() {
    const { mouseY, isPressed, originalPosOfLastPressed } = this.state;
    console.log('on render', this.state.todos);
    return (
      <div className="react-motion-todo-wrapper">
        <div className="react-motion-create-todo">
          <a className="plus-wrapper">
            <span className="icono-plus">{}</span>
          </a>
          <input
            type="text"
            className="to-do-task-input"
            maxLength="255"
            placeholder="Add a To-do..."
            aria-label="Add a To-do"
            onKeyPress={
              keypress('enter', this.addTodo)
            }
          />
        </div>
        <div className="react-motion-new-todo">
          {this.state.todos.map((todo) => {
            const style = originalPosOfLastPressed === todo.pos && isPressed
              ? {
                scale: spring(1, springConfig),
                shadow: spring(10, springConfig),
                y: mouseY
              }
              : {
                scale: spring(1, springConfig),
                shadow: spring(1, springConfig),
                y: spring(todo.pos * 50, springConfig)
              };
            return (
              <Motion style={style} key={todo.id}>
                {({ scale, shadow, y }) =>
                  <div
                    onMouseDown={this.handleMouseDown.bind(null, todo.pos, y)}
                    onTouchStart={this.handleTouchStart.bind(null, todo.pos, y)}
                    className="react-motion-todo-item"
                    style={{
                      boxShadow: `rgba(0, 0, 0, 0.2) 0px ${shadow}px ${2 * shadow}px 0px`,
                      transform: `translate3d(0, ${y}px, 0) scale(${scale})`,
                      WebkitTransform: `translate3d(0, ${y}px, 0) scale(${scale})`,
                      zIndex: todo.pos === originalPosOfLastPressed ? 99 : todo.pos
                    }}
                  >
                    <input
                      className="toggle"
                      type="checkbox"
                      onChange={(e) => { this.completeTodo(e.target.value, todo.pos); }}
                      checked={todo.isCompleted}
                    />
                    <div className="todo-text">
                      {todo.text}
                    </div>

                  </div>
                }
              </Motion>
            );
          })}
        </div>
        <div className="react-motion-completed-todo">
          {}
        </div>
      </div>
    );
  }
}
