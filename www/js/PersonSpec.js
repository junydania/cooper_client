describe('Person', function() {
  beforeEach(function() {
    person = new Person({
      gender: 'Male',
      age: 46
    });
  });

  it('should have gender', function() {
    expect(person.gender).toBeDefined();
    expect(person.gender).toBe('Male');
  });

  it('should have age', function() {
    expect(person.age).toBeDefined();
    expect(person.age).toBe(46);
  });
});
