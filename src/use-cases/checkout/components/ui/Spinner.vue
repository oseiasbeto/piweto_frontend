<template>
    <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
</template>


<style scoped>
.lds-ring,
.lds-ring div {
  box-sizing: border-box;
}

.lds-ring {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}

.lds-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 64px;
  height: 64px;
  margin: 8px;
  border: 8px solid currentColor;
  border-radius: 50%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: currentColor transparent transparent transparent;
}

.lds-ring div:nth-child(1) {
  animation-delay: -0.45s;
}

.lds-ring div:nth-child(2) {
  animation-delay: -0.3s;
}

.lds-ring div:nth-child(3) {
  animation-delay: -0.15s;
}

@keyframes lds-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Responsividade */
@media (max-width: 600px) {
  .lds-ring {
    width: 50px;
    height: 50px;
  }

  .lds-ring div {
    width: 40px;
    height: 40px;
    margin: 5px;
    border-width: 5px;
  }
}

@media (max-width: 400px) {
  .lds-ring {
    width: 40px;
    height: 40px;
  }

  .lds-ring div {
    width: 30px;
    height: 30px;
    margin: 5px;
    border-width: 4px;
  }
}
</style>
