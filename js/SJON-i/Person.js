function Person() {
  this.name;
  this.age;
  /* father and mother can be independent Peron instances, 
   * but initializing them to Peron instances results in infinite call stack
   */
  this.father;
  this.mother;
}