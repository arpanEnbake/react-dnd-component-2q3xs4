import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './style.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import PharseData from './coreComponents';
import {
  Checkbox,
  Card,
  Collapse,
  Row,
  Col,
  Radio,
  Button,
  Form,
  Space,
  Input
} from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';

const CheckboxGroup = ({ id }) => {
  return (
    <>
      <Form.List name={`users_${id}`}>
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, fieldKey, ...restField }) => (
              <Space
                key={key}
                style={{ display: 'flex', marginBottom: 8 }}
                align="baseline"
              >
                <Form.Item
                  {...restField}
                  name={[name, 'first']}
                  fieldKey={[fieldKey, 'first']}
                  rules={[{ required: true, message: 'Missing first name' }]}
                >
                  <Input placeholder="First Name" />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, 'last']}
                  fieldKey={[fieldKey, 'last']}
                  rules={[{ required: true, message: 'Missing last name' }]}
                >
                  <Input placeholder="Last Name" />
                </Form.Item>
                <MinusCircleOutlined onClick={() => remove(name)} />
              </Space>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
              >
                Add field
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </>
  );
};
const leftPan = PharseData.configData;
leftPan.map((element, index) => {
  id: element.id;
  label: element.label;
  type: element.type;
  index: index;
});

const rightPan = (count, offset = 0) =>
  Array.from({ length: count }, (v, k) => k).map(k => ({
    id: `right-${k + offset}`,
    label: `right ${k + offset}`
  }));

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (
  source,
  destination,
  droppableSource,
  droppableDestination,
  count
) => {
  debugger;
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  //const [removed] = sourceClone.splice(droppableSource.index, 1);

  var droppableDestinationProp = source[droppableSource.index];
  const add = {
    id: droppableDestinationProp.label + '_' + count,
    type: droppableDestinationProp.type
  };
  destClone.splice(droppableDestination.index, 0, add);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;
  return result;
};

const grid = 10;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: grid * 2,
  margin: '10px',

  // change background colour if dragging
  background: isDragging ? 'lightgreen' : 'white',

  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'lightblue' : '#e6e6e6',
  width: 250
});

const getListStyleDragPart = isDraggingOver => ({
  border: '2px dashed #ccc',
  background: isDraggingOver ? 'lightblue' : '#e6e6e6',
  width: '100%',
  margin: '0 20px'
});

const App = () => {
  const [form] = Form.useForm();

  const [state, setState] = useState({
    items: leftPan,
    selected: rightPan(),
    count: 0,
    showPropContainer: [],
    labelName: []
  });

  const id2List = {
    components: 'items',
    canvas: 'selected'
  };

  const getList = id => {
    const comp = id2List[id];
    return state[`${comp}`];
  };

  const onDragStart = start => {
    const homeIndex = start.source.droppableId;
    setState({ ...state, homeIndex });
  };

  const onDragEnd = result => {
    const { source, destination } = result;
    console.log(form.getFieldsValue(), destination, source);
    // dropped outside the list
    if (!destination) {
      debugger;
      return;
    }

    if (source.droppableId === destination.droppableId) {
      if (source.droppableId === 'components') {
        return;
      }

      if (source.droppableId === 'canvas') {
        const items = reorder(
          getList(source.droppableId),
          source.index,
          destination.index
        );

        let state2 = { items };
        state2 = { selected: items };
        setState({ ...state, ...state2 });
      }
    } else {
      if (destination.droppableId === 'components') {
        return;
      }
      const result = move(
        getList(source.droppableId),
        getList(destination.droppableId),
        source,
        destination,
        state.count
      );

      setState({
        ...state,
        items: result.components,
        selected: result.canvas,
        count: state.count + 1
      });
    }
  };

  const setContType = (id, type) => {
    console.log(id, type);
    switch (type) {
      case 'multiSelect':
        return <CheckboxGroup id={id} />;
      default:
        return (
          <Form.Item label="Question" id={id} name={id}>
            <Input />
          </Form.Item>
        );
    }
  };

  const toggleAction = (actionName, clickedItem, e) => {
    debugger;
    if (actionName === 'remove') {
      const newState = state.selected.filter(function(ele) {
        return ele.id != clickedItem;
      });
      setState({ ...state, selected: newState });
    } else if (actionName === 'edit') {
      handleDoubleClickItem();
    } else if (actionName === 'copy') {
      var copieditem = state.selected.filter(function(ele) {
        return ele.id === clickedItem;
      });
      //let newCnt = parseInt(copieditem[0].id.match(/\d+/)[0]) + state.count;
      let newCopyItem = JSON.parse(JSON.stringify(copieditem));
      newCopyItem[0].id = newCopyItem[0].id.split('_')[0] + '_' + state.count;
      var newArray = state.selected.slice();
      //newArray.push(newCopyItem);
      var mergerItems = newArray.concat(newCopyItem);
      setState({ ...state, selected: mergerItems, count: state.count + 1 });
    }
  };

  const handleDoubleClickItem = (id, type, e) => {};

  const handleInputChange = e => {
    debugger;
    var labelName = state.labelName;
    labelName[state.curID] = e.target.value;
    setState({ ...state, labelName });
  };

  return (
    <Form form={form}>
      <React.Fragment>
        <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
          <Droppable
            droppableId="components"
            isDropDisabled={state.homeIndex === 'canvas'}
          >
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                style={getListStyle(snapshot.isDraggingOver)}
              >
                {state.items.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(
                          snapshot.isDragging,
                          provided.draggableProps.style
                        )}
                      >
                        <i className={item.icon} />
                        <span data-type={item.type} className="pan-text">
                          {item.label}
                        </span>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          <Droppable droppableId="canvas">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                style={getListStyleDragPart(snapshot.isDraggingOver)}
              >
                {state.selected.length > 0 ? (
                  state.selected.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          className="dragElement"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                          )}
                          onDoubleClick={handleDoubleClickItem.bind(
                            this,
                            item.id,
                            item.type
                          )}
                        >
                          <Collapse
                            collapsible="header"
                            defaultActiveKey={['1']}
                          >
                            <Card
                              label={item.id}
                              extra={
                                <div className="field-actions">
                                  <a
                                    type="remove"
                                    className="toggle-formActions"
                                    title="Remove"
                                    onClick={toggleAction.bind(
                                      this,
                                      'remove',
                                      item.id
                                    )}
                                  >
                                    <i className="fa fa-window-close" />
                                  </a>
                                  <a
                                    type="copy"
                                    className="toggle-formActions"
                                    title="Copy"
                                    onClick={toggleAction.bind(
                                      this,
                                      'copy',
                                      item.id
                                    )}
                                  >
                                    <i className="fa fa-clone" />
                                  </a>
                                </div>
                              }
                            >
                              {setContType(item.id, item.type)}
                            </Card>
                          </Collapse>
                        </div>
                      )}
                    </Draggable>
                  ))
                ) : (
                  <h1 style={{ color: '#999', textAlign: 'center' }}>
                    {' '}
                    Drage Item Here{' '}
                  </h1>
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </React.Fragment>
    </Form>
  );
};

// Put the things into the DOM!
ReactDOM.render(<App />, document.getElementById('root'));
