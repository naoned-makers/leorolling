import * as React from 'react'

export class Baseplate extends React.Component {

    constructor(props, context) {

        super(props, context);

        var screen = {
            width : window.innerWidth,
            height : window.innerHeight
        } ;

        var sizeX = screen.width / this.props.width ;
        sizeX = sizeX > 40 ? 40 : Math.floor(sizeX) ;
        var sizeY = screen.height / this.props.height ;
        sizeY = sizeY > 40 ? 40 : Math.floor(sizeY) ;

        if(sizeX < sizeY) sizeY = sizeX;
        if(sizeY < sizeX) sizeX = sizeY;

        var size = sizeX ;

        var grid = {
            nbOfCellsX : Math.ceil(Math.ceil(screen.width / size) / 2) * 2 ,
            nbOfCellsY : Math.ceil(Math.ceil(screen.height / size) / 2) * 2 ,
        };

        grid.minX = (grid.nbOfCellsX - this.props.width) / -2;
        grid.maxX = (grid.nbOfCellsX - this.props.width) / 2 + 1 + this.props.width ;
        grid.minY = (grid.nbOfCellsY - this.props.height) / -2;
        grid.maxY = (grid.nbOfCellsY - this.props.height) / 2 + 1 + this.props.height ;
        grid.width = grid.nbOfCellsX * size ;
        grid.height = grid.nbOfCellsY * size ;
        grid.sizeElt = size ;

        this.state = grid ;

    }

    render() {

      let style = {
        width: this.state.sizeElt,
        height: this.state.sizeElt
      }

      let className = "lego darkgrey";
      let onClick = undefined;

      let divs = [];
      for (let y = this.state.minY ; y < this.state.maxY ; y++) {
        if(y === 0) continue ;
        for(let x = this.state.minX ; x < this.state.maxX ; x++){
          if(x === 0) continue ;
          divs.push(<div key={y+"_"+x} className={className} style={style} x={x} y={y}/>);
        }
      }

      return (
        <div className="baseplate" style={{width: this.state.width, height: this.state.height}}>
          {divs}
        </div>
      );
    }

    componentDidMount() {
      this.props.children.forEach((child) => {
        let selectElts  = document.querySelectorAll(child.props.bricks.map((brick)=>{return "[x='"+brick.x+"'][y='"+brick.y+"']"}).join(","));
        selectElts.forEach((elt)=>{
          elt.className = child.props.classShape;
          if (!child.props.onTouchStart && !child.props.onTouchEnd && !child.props.activeClassShape) return;
          elt.addEventListener("touchstart", (e) => {
            if (child.props.activeClassShape) {
              selectElts.forEach((elem)=>{
                elem.className = child.props.activeClassShape;
              });
            }
            if (child.props.onTouchStart) {
              child.props.onTouchStart();
            }
          });
          elt.addEventListener("touchend", (e) => {
            if (child.props.classShape) {
              selectElts.forEach((elem)=>{
                elem.className = child.props.classShape;
              });
            } else {
              elt.className = "lego darkgrey";
            }
            if (child.props.onTouchEnd) {
              child.props.onTouchEnd();
            }
          });
        });
      });
    }
}

Baseplate.defaultProps = {
    height: 10,
    width: 10
};
