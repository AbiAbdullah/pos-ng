export interface Table {
  name: string;
  section: string;
  shape: string;
  position: any;
  currentPosition: any;
}
export interface Floorplan {
  name: string;
  image: any;
  tables: Table[];

}
