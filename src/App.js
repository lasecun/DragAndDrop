import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import {find, findIndex, remove, cloneDeep, sortBy} from 'lodash';

const getItemStyle = (draggableStyle) => {
    return {
        userSelect: 'none',
        cursor: 'grab',
        // styles to apply on draggables
        ...draggableStyle,
        margin: draggableStyle && draggableStyle.margin ? draggableStyle.margin : '10px'
    };
};


class App extends Component {

    list = () => {
        return [{
            index: 'List1', content: [
                {
                    id: 1,
                    name: 'Pablo',
                    surname: 'Garcia'
                }, {
                    id: 2,
                    name: 'Juanjo',
                    surname: 'Lopez'
                }]
        },
            {
                index: 'List2', content: [
                    {
                        id: 3,
                        name: 'Prueba1',
                        surname: 'Garcia'
                    }, {
                        id: 4,
                        name: 'Prueba2',
                        surname: 'Lopez'
                    }]
            }]
    };

    constructor(props) {
        super(props);
        this.state = {
            list: this.list()
        };
    }

    onDragEnd = (result) => {

        if (!result.destination) {
            return;
        }


        // did not move anywhere - can bail early
        if (
            result.source.droppableId === result.destination.droppableId &&
            result.source.index === result.destination.index
        ) {
            return;
        }

        let destination = find(cloneDeep(this.state.list), {index: result.destination.droppableId});
        let source = find(cloneDeep(this.state.list), {index: result.source.droppableId});

        let itemIndexToRemove = findIndex(source.content, {id: result.draggableId});

        let item = source.content[itemIndexToRemove];

        destination.content.push(item);
        source.content.splice(itemIndexToRemove, 1);

        let list = [{...destination}, {...source}];
        list = sortBy(list, [function (list) {
            return list.index;
        }]);

        this.setState({
            list: list
        })
    };


    render() {
        console.log(this.state);
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h1 className="App-title">Welcome to React</h1>
                </header>
                <p className="App-intro">
                    To get started, edit <code>src/App.js</code> and save to reload.
                </p>
                <DragDropContext
                    onDragEnd={(result) => {
                        this.onDragEnd(result);
                    }}
                >
                    <Droppable droppableId='List1' isDropDisabled={false}>
                        {(dropProvided, snapshot) => (
                            <div className={`blacked-${snapshot.isDraggingOver} user-category-content`}
                                 ref={dropProvided.innerRef}>
                                <div className='user-category-cover-block'>
                                    <div className='user-category-content-wrapper'>
                                        <div className='user-category-list scrollStyle'>
                                            {this.state.list[0].content.map((item) => {
                                                return (
                                                    <Draggable key={item.id} isDragDisabled={false}
                                                               draggableId={item.id}>
                                                        {(provided, snapshot) => (
                                                            <div className='user-items-wrapper'
                                                                 ref={provided.innerRef}
                                                                 style={getItemStyle(provided.draggableStyle, snapshot)}
                                                                 {...provided.dragHandleProps}>
                                                                <div>{item.name}</div>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </Droppable>

                    <Droppable droppableId='List2' isDropDisabled={false} index={'List2'}>
                        {(dropProvided, snapshot) => (
                            <div className={`blacked-${snapshot.isDraggingOver} user-category-content`}
                                 ref={dropProvided.innerRef}>
                                <div className='user-category-cover-block'>
                                    <div className='user-category-content-wrapper'>
                                        <div className='user-category-list scrollStyle'>
                                            {this.state.list[1].content.map((item) => {
                                                return (
                                                    <Draggable key={item.id} isDragDisabled={false}
                                                               draggableId={item.id}>
                                                        {(provided, snapshot) => (
                                                            <div className='user-items-wrapper'
                                                                 ref={provided.innerRef}
                                                                 style={getItemStyle(provided.draggableStyle, snapshot)}
                                                                 {...provided.dragHandleProps}>
                                                                <div>{item.name}</div>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </Droppable>

                </DragDropContext>
            </div>
        );
    }
}

export default App;
