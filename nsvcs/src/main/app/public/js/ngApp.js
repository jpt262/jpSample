angular.module("app", [])
  .controller("MainController", function($scope, $interval) {
    
    var reached = false;

    $scope.log = function(input) {
      console.log(input)
    }

    //init populations
    var leftBound = topBound = 0,
    rightBound = 800;
    bottomBound = 800;

    var carryingCapacity = 300;

    var plantPopulation = 100;
    $scope.plantEcosystem = [];

    var gazellePopulation = 40;
    $scope.gazelleEcosystem = [];

    var lionPopulation = 20;
    $scope.lionEcosystem = [];

    function newPopGen (n, ecosystem, life) {
      var i = 0;
      for (; i < n; i += 1) {
        var newLife = life();
        ecosystem.push(newLife)
      };
    }

    newPopGen(plantPopulation, $scope.plantEcosystem, plant)
    newPopGen(gazellePopulation, $scope.gazelleEcosystem, gazelle)
    newPopGen(lionPopulation, $scope.lionEcosystem, lion)

    function populationGenerator(population, ecosystem, locomotion) {
      var i = 0;
      for (; i < population; i += 1) {
        if (locomotion) {
            xVel = randomVector(5);
            yVel = randomVector(5);
        } else {
            xVel = 0;
            yVel = 0;
        }
        ecosystem.push({
            x: randomDimension(rightBound),
            y: randomDimension(bottomBound),
            xVel: xVel,
            yVel: yVel
        });
      }
    };

    function randomDimension(int) {
      return Math.floor(Math.random() * int) + 1;
    };

    function polarity () {
      var pole;
      if (Math.floor(Math.random() * 2) == 1) {
          pole = 1;
      } else {
          pole = -1;
      }
      return pole;
    }

    function randomVector(int) {
      var num = Math.floor(Math.random() * int) + 1;

      num *= polarity();
      return num
    }

    //animate every 50ms
    $interval(animate, 50)

    function animate () {
      movePopulation();
      if($scope.lionEcosystem.length === carryingCapacity && !reached) {
        reached = true;
        $scope.lionEcosystem[0].roar();
      }
    }

    function live(self, ecosystem, preyEcosystem, i) {
        self.energy -= 0.5;
        if(self.energy <= 0) {
          ecosystem.splice(i, 1);
        } else if(self.energy > 30 && ecosystem.length < carryingCapacity) {
          reproduceChecker(self, ecosystem, i);
        }
        foodChecker(self, preyEcosystem);
        
        moveUnit(self);
    }

    function movePopulation() {
      for (var i in $scope.gazelleEcosystem) {
        live($scope.gazelleEcosystem[i], $scope.gazelleEcosystem, $scope.plantEcosystem, i)
      }
      for (var i in $scope.lionEcosystem) {
        live($scope.lionEcosystem[i], $scope.lionEcosystem, $scope.gazelleEcosystem, i)
      }
      for (var i in $scope.plantEcosystem) {
        if($scope.plantEcosystem.length < carryingCapacity) {
          $scope.plantEcosystem[i].reproduce();
        }
      }
    }

    function foodChecker(predator, preyEcosystem) {
      for (var i in preyEcosystem) {
        if (predator && predator.energy < predator.energyMax && preyEcosystem[i].x <= predator.x + 10 && preyEcosystem[i].x >= predator.x - 10 && preyEcosystem[i].y <= predator.y + 10 && preyEcosystem[i].y >= predator.y - 10) {
          predator.energy += preyEcosystem[i].energy;
          preyEcosystem.splice(i, 1); 
        }
      }
    }

    function reproduceChecker (self, ecosystem) {
      for(var j in ecosystem) {
        if(self && self !== ecosystem[j] && ecosystem[j].x <= self.x + 10 && ecosystem[j].x >= self.x - 10 && ecosystem[j].y <= self.y + 10 && ecosystem[j].y >= self.y - 10 && ecosystem[j].sex < 0 && self.sex > 0) {
          self.reproduce(ecosystem);
        }
      }
    }

    function moveUnit(unit) {
      if (unit && unit.xVel > 0) {
        if (unit.x < rightBound) {
          unit.x += unit.xVel;
        } else {
          unit.x = 0;
        }
      } else {
        if (unit && unit.x > 0) {
          unit.x += unit.xVel;
        } else if(unit) {
          unit.x = rightBound;
        }
      }

      if (unit && unit.yVel > 0) {
        if (unit.y < bottomBound) {
          unit.y += unit.yVel;
        } else {
          unit.y = 0;
        }
      } else if(unit) {
        if (unit.y > 0) {
          unit.y += unit.yVel;
        } else {
          unit.y = bottomBound;
        }
      }
    }

    function lifeform () {
      return {
        x: randomDimension(rightBound),
        y: randomDimension(bottomBound),
        sex: polarity(),
        deathChance: 0.3
      }
    }

    function plant () {
      var that = lifeform();
      that.species = 'plant';
      that.energy = 100;
      that.xVel = that.yVel = 0;
      that.locomotion = false;
      that.reproductionChance = 0.05;
      that.reproduce = function() {
        if(that.sex > 0 && randomDimension(1000) <= that.reproductionChance*1000) {
          var newPlant = plant();
          $scope.plantEcosystem.push(newPlant);
        }
      }
      return that;
    };

    function animal () {
      var that = lifeform();
      that.energyMax = 100;
      that.energy = that.energyMax;
      that.xVel = randomVector(5);
      that.yVel = randomVector(5);
      that.locototion = true;
      that.reproductionChance = 0.5;
      that.reproduce = function(ecosystem) {
        if(that.sex > 0 && randomDimension(100) <= that.reproductionChance*100) {
          var newAnimal = animal();
          newAnimal.x = that.x+randomVector(50);
          newAnimal.y = that.y+randomVector(50);
          newAnimal.energy = 25;
          newAnimal.species = that.species;
          ecosystem.push(newAnimal)
        }
      }
      return that;
    };

    function gazelle () {
      var that = animal();
      that.species = 'gazelle';
      that.eats = 'plant';
      return that;
    }

    function lion () {
      var that = animal();
      that.species = 'lion';
      that.eats = 'gazelle';
      that.energyMax = 300;
      that.energy = that.energyMax;
      that.roar = function() { console.log('meow'); }
      return that;
    }
});