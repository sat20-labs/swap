<template>
  <div class="max-w-7xl mx-auto">
    <!-- Hero Section -->
    <section class="text-center mb-12">
      <h1 class="text-4xl font-bold mb-4">
        Decentralized Trading Platform
      </h1>
      <p class="text-xl text-gray-600 dark:text-gray-400 mb-8">
        Trade digital assets securely and efficiently
      </p>
      <UButton
        to="/swap"
        size="lg"
      >
        Start Trading
      </UButton>
    </section>

    <!-- Market Overview -->
    <MarketOverview />

    <!-- Trading Pairs List -->
    <TradingPairsList />
  </div>
</template>