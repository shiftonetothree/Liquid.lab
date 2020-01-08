function TestWatherBall() {
  camera.position.y = 1;
  camera.position.z = 2.5;

  var bd = new b2BodyDef();
  var ground = world.CreateBody(bd);

  bd.type = b2_dynamicBody;
  bd.allowSleep = false;
  bd.position.Set(0, 1);
  var body = world.CreateBody(bd);

  var b1 = new b2PolygonShape();
  b1.SetAsBoxXYCenterAngle(0.05, 1, new b2Vec2(0.5, 0), 0);
  body.CreateFixtureFromShape(b1, 5);

  var b2 = new b2PolygonShape();
  b2.SetAsBoxXYCenterAngle(0.05, 1, new b2Vec2(-0.5, 0), 0);
  body.CreateFixtureFromShape(b2, 5);

  var b3 = new b2PolygonShape();
  b3.SetAsBoxXYCenterAngle(2, 0.05, new b2Vec2(0, 1), 0);
  body.CreateFixtureFromShape(b3, 5);

  var b4 = new b2PolygonShape();
  b4.SetAsBoxXYCenterAngle(2, 0.05, new b2Vec2(0, -0.5), 0);
  body.CreateFixtureFromShape(b4, 5);

  var b5 = new b2PolygonShape();
  b5.SetAsBoxXYCenterAngle(2, 0.05, new b2Vec2(-1.25, 2), Math.PI * -0.3);
  body.CreateFixtureFromShape(b5, 5);

  var b6 = new b2PolygonShape();
  b6.SetAsBoxXYCenterAngle(2, 0.05, new b2Vec2(1.25, 2), Math.PI * 0.3);
  body.CreateFixtureFromShape(b6, 5);

  var jd = new b2RevoluteJointDef();
  jd.motorSpeed = 0;
  jd.maxMotorTorque = 1e7;
  jd.enableMotor = true;
  this.joint = jd.InitializeAndCreate(ground, body, new b2Vec2(0, 1));
  this.time = 0;

  // setup particles
  var psd = new b2ParticleSystemDef();

  // 粒子大小
  psd.radius = 0.02;
  psd.dampingStrength = 0.2;

  this.particleSystem = world.CreateParticleSystem(psd);
  // 重力
  world.SetGravity(new b2Vec2(0, -9.8));
  
}

TestWatherBall.prototype.Step = function() {
  if(Math.floor(this.time * 60) % 6 === 0){
    var box = new b2PolygonShape();
    box.SetAsBoxXYCenterAngle(0.06, 0.03, new b2Vec2(0, 1.8), Math.random() * Math.PI);
  
    var pgd = new b2ParticleGroupDef();
    pgd.shape = box;
    pgd.color.Set(255, 255, 255, 255);
    var particleGroup = this.particleSystem.CreateParticleGroup(pgd);
  }

  

  

  if(this.particleSystem.particleGroups.length>100){

    // // 从固定位置创造一个黑洞删除粒子
    // var box = new b2PolygonShape();
    // box.SetAsBoxXYCenterAngle(0.1, 0.1, new b2Vec2(-0.5 + Math.random(), 0.5 + Math.random()), 0);
    // this.particleSystem.DestroyParticlesInShape(box,new b2Transform());
    
    // 删除最早创建的粒子
    const particleGroupOld = this.particleSystem.particleGroups[0];
    particleGroupOld.DestroyParticles();
    this.particleSystem.particleGroups.shift();
  }
  

  world.Step(timeStep, velocityIterations, positionIterations);
  this.time += 1 / 60;
  // this.joint.SetMotorSpeed(0.05 * Math.cos(this.time) * Math.PI);
}