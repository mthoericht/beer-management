<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <header class="border-b bg-card">
      <div class="container mx-auto px-4 py-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-amber-600"><path d="M17 11h1a3 3 0 0 1 0 6h-1"/><path d="M9 12v6"/><path d="M13 12v6"/><path d="M14 7.5c-1 0-1.44.5-3 .5s-2-.5-3-.5-1.72.5-2.5.5a2.5 2.5 0 0 1 0-5c.78 0 1.57.5 2.5.5S9.44 3 11 3s2 .5 3 .5 1.72-.5 2.5-.5a2.5 2.5 0 0 1 0 5c-.78 0-1.5-.5-2.5-.5Z"/><path d="M5 8v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8"/></svg>
            <div>
              <h1 class="text-3xl font-bold">Beer Management</h1>
              <p class="text-sm text-muted-foreground">Manage your beer list</p>
            </div>
          </div>
          <Button size="lg" @click="openAddForm">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
            Add Beer
          </Button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
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
            <!-- Search and Filters -->
            <div class="flex flex-col md:flex-row gap-4">
              <div class="relative flex-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                <Input
                  v-model="searchQuery"
                  placeholder="Search beer, brewery or style..."
                  class="pl-10"
                />
              </div>

              <Select v-model="filterStatus" class="w-full md:w-[200px]">
                <option value="all">All Beers</option>
                <option value="drank">Drank</option>
                <option value="toTry">To Try</option>
              </Select>

              <Select v-model="sortBy" class="w-full md:w-[200px]">
                <option value="dateAdded">Date Added</option>
                <option value="name">Name</option>
                <option value="rating">Rating</option>
              </Select>
            </div>

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

    <!-- Beer Form Dialog -->
    <Dialog :open="showForm" @close="handleCancelForm">
      <div class="mb-4">
        <h3 class="text-lg font-semibold">
          {{ editingBeer ? 'Edit Beer' : 'Add New Beer' }}
        </h3>
        <p class="text-sm text-muted-foreground">
          {{ editingBeer ? 'Update the details of your beer.' : 'Add a new beer to your list.' }}
        </p>
      </div>
      <BeerForm
        :beer="editingBeer"
        @save="handleSaveBeer"
        @cancel="handleCancelForm"
      />
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Button from './components/ui/Button.vue'
import Input from './components/ui/Input.vue'
import Select from './components/ui/Select.vue'
import Dialog from './components/ui/Dialog.vue'
import Tabs from './components/ui/Tabs.vue'
import TabsList from './components/ui/TabsList.vue'
import TabsTrigger from './components/ui/TabsTrigger.vue'
import TabsContent from './components/ui/TabsContent.vue'
import BeerList from './components/BeerList.vue'
import BeerForm from './components/BeerForm.vue'
import BeerStats from './components/BeerStats.vue'
import LoadingSpinner from './components/LoadingSpinner.vue'
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
