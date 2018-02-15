// So you're writing your first Javascript library. Shit got real fast.
// Fuck I miss Python :(

export class Point {
  constructor(x, y, z = 0) {
    this.x = x
    this.y = y
    this.z = z
  }
};

export const origin = new Point(0,0,0)

export class Vector {
    constructor(PointA, PointB) {
      this.start  = (typeof PointB !== 'undefined') ? PointA : origin
      this.end    = (typeof PointB !== 'undefined') ? PointB : PointA
      this.length = Math.sqrt(Math.pow((this.end.x - this.start.x), 2)
                            + Math.pow((this.end.y - this.start.y), 2)
                            + Math.pow((this.end.z - this.start.z), 2))
    }
}




// export function vectorAddition(VectorA, VectorB) {
//   return (VectorA.x + VectorB.x)
// }

export function scalarProduct(VectorA, VectorB) {
  return (VectorA.x * VectorB.x)
       + (VectorA.y * VectorB.y)
       + (VectorA.z * VectorB.z)
}

const a = new Point(1,2)
const b = new Point(2,3)
const vec = new Vector(a, b)

console.log(new Vector(new Point(3,4)).length);
console.log(new Vector(new Point(7,100), new Point(10,104)).length);



const image = {
  height : 4,
  width : 3,
}
