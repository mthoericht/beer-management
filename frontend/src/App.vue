<template>
  <div class="min-h-screen bg-background">
    <AppHeader @add-beer="openAddForm" />

    <main class="container mx-auto px-4 py-8">
      <div v-if="error" class="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive mb-6">
        <strong>Error:</strong> {{ error }}
      </div>

      <LoadingSpinner v-if="loading === 'loading'" />

      <template v-else>
        <Tabs default-value="list">
          <TabsList class="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="list">Beer List</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>

          <TabsContent value="list" class="space-y-6">
            <BeerFilters
              v-model:search-query="searchQuery"
              v-model:filter-status="filterStatus"
              v-model:sort-by="sortBy"
            />

            <BeerList
              :beers="filteredBeers"
              @delete="handleDeleteBeer"
              @edit="handleEditBeer"
              @mark-as-drank="handleMarkAsDrank"
            />
          </TabsContent>

          <TabsContent value="stats">
            <BeerStats :beers="beers" />
          </TabsContent>
        </Tabs>
      </template>
    </main>

    <BeerFormDialog
      :open="showForm"
      :editing-beer="editingBeer"
      @close="handleCancelForm"
      @save="handleSaveBeer"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AppHeader from './components/layout/AppHeader.vue'
import BeerFilters from './components/beer/BeerFilters.vue'
import BeerList from './components/beer/BeerList.vue'
import BeerStats from './components/beer/BeerStats.vue'
import BeerFormDialog from './components/beer/BeerFormDialog.vue'
import LoadingSpinner from './components/LoadingSpinner.vue'
import Tabs from './components/ui/Tabs.vue'
import TabsList from './components/ui/TabsList.vue'
import TabsTrigger from './components/ui/TabsTrigger.vue'
import TabsContent from './components/ui/TabsContent.vue'
import { BeerManager } from './services/BeerManager'
import { Beer, BeerInput } from './types/BeerInterfaces'

const manager = new BeerManager()

const beers = manager.beers
const loading = manager.loading
const error = manager.error
const showForm = manager.showForm
const editingBeer = manager.editingBeer

const searchQuery = ref('')
const filterStatus = ref<string>('all')
const sortBy = ref<string>('dateAdded')

const filteredBeers = computed(() => {
  return beers.value
    .filter((beer) => {
      const matchesSearch =
        beer.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        beer.brewery.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        beer.style.toLowerCase().includes(searchQuery.value.toLowerCase())

      const matchesStatus =
        filterStatus.value === 'all' ||
        (filterStatus.value === 'drank' && beer.drank) ||
        (filterStatus.value === 'toTry' && !beer.drank)

      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      if (sortBy.value === 'name') {
        return a.name.localeCompare(b.name)
      } else if (sortBy.value === 'rating') {
        return (b.rating || 0) - (a.rating || 0)
      } else {
        return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
      }
    })
})

const openAddForm = () => {
  manager.editingBeer.value = undefined
  manager.showForm.value = true
}
const handleSaveBeer = (beerData: BeerInput) => manager.handleSaveBeer(beerData)
const handleMarkAsDrank = (id: string) => manager.handleMarkAsDrank(id)
const handleDeleteBeer = (id: string) => manager.handleDeleteBeer(id)
const handleEditBeer = (beer: Beer) => manager.handleEditBeer(beer)
const handleCancelForm = () => manager.handleCancelForm()

onMounted(() => {
  manager.fetchBeers()
})
</script>
