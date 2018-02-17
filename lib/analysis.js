// Basically reimplemented classes because it did not know about initialising
// without 'new'. Also, I did't want to use Victor because it does way too much.

const point = (x, y, z = 0) => ({ x:x, y:y, z:z });

/*  Why won't this worK?!

export const vector = (pointA, pointB) => ({
  start  : (typeof pointB !== 'undefined') ? pointA : point(0,0,0),
  end    : (typeof pointB !== 'undefined') ? pointB : pointA,
  length : () => Math.sqrt(Math.pow((this.end.x - this.start.x), 2)
                          + Math.pow((this.end.y - this.start.y), 2)
                          + Math.pow((this.end.z - this.start.z), 2))
});

*/


const vector = (startPoint, endPoint) => {
  const start = (typeof endPoint !== 'undefined') ? startPoint : point(0,0,0);
  const end   = (typeof endPoint !== 'undefined') ? endPoint
              : (typeof startPoint !== 'undefined') ? startPoint : point(0,0,0);
  const relative = point(end.x - start.x, end.y - start.y)
  return {
      'start'      : start,
      'end'        : end,
      'relative'   : relative,
      'length'     : Math.hypot(relative.x, relative.y, relative.z),
      'angleXY'    : Math.atan2(relative.x, relative.y),
      'add'        : (addVector) => vector(start,
                                    point(end.x + (addVector.relative.x),
                                          end.y + (addVector.relative.y),
                                          end.z + (addVector.relative.z))),
      'move'       : (target) => vector(target, point(target.x + relative.x,
                                                      target.y + relative.y,
                                                      target.z + relative.z)),
      'multiply'   : (factor) =>
                      vector(startPoint,
                             point(startPoint.x + relative.x * factor,
                                   startPoint.y + relative.y * factor,
                                   startPoint.z + relative.z * factor)),
      'fromRadians': (radians) => vector(point(Math.sin(radians),
                                               Math.cos(radians))),
    }
}

// /*  Tests:

// console.log(vector(point(1,1), point(4,5)).add(vector(point(3,4))));
// console.log(vector(point(1,1), point(4,5)).add(vector(point(1,1),point(4,5))));
// console.log('multiply() should return (1,1)->(7,9)');
// console.log(vector(point(1,1), point(4,5)).multiply(2));
// console.log('fromRadians(π/2) should return (1,1 -> 2,1)')
// console.log(vector().fromRadians(Math.PI*0.5).move(point(1,1)));

// */

export const fitRectangleTwoPoint = (width, height, lowerLeft, upperRight) =>  {

  // lowerLeft and upperRight should be in the format of eiter [x,y] or
  // { 'x':x, 'y':y, 'z':z }

  const image = { width : width, height : height };
  const imageDiagonal = vector(point(image.width, image.height));
  const pointA = point(...Object.values(lowerLeft));
  const pointC = point(...Object.values(upperRight));
  const newDiagonal = vector(pointA, pointC);
  const scalingFactor = newDiagonal.length / imageDiagonal.length;
  const pointB = vector().fromRadians(newDiagonal.angleXY - imageDiagonal.angleXY)
                .move(pointC)
                .multiply(scalingFactor * image.height * (-1)).end;
  const pointD = vector().fromRadians(newDiagonal.angleXY - imageDiagonal.angleXY)
                .move(pointA)
                .multiply(scalingFactor * image.height).end;

// console.log('imageDiagonal', imageDiagonal);
// console.log('newDiagonal', newDiagonal);
// console.log('scalingFactor', scalingFactor);

  return ((Array.isArray(lowerLeft, upperRight))
       ? [pointA, pointB, pointC, pointD].map(point =>
            Object.values(point).slice(0,Math.max(lowerLeft.length,
                                                  upperRight.length)))
       : [pointA, pointB, pointC, pointD])

}



/*  Tests: */


// console.log(fitRectangleTwoPoint(678,512, [13.40713978,52.51845369],[13.41108799,52.52033387]))
