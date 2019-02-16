<template>
  <div id='dashboard'>
    <section>
      <div
        class='col1'
        v-if='!hideSidebar'
      >
        <div class='profile'>
          <div class='profile-header'>
            <h5>{{ userProfile.name }}</h5>
            <p>{{ userProfile.title }}</p>
          </div>
          <hr>
          <div class='create-payment'>
            <p>Add a payment</p>
            <form @submit.prevent>
              <input
                v-model.trim='payment.amount'
                placeholder="amount"
                class="amount"
              />
              <input
                v-model.trim='payment.description'
                placeholder="description"
                class="description"
              />
              <button
                @click='createPayment'
                :disabled="payment.description == '' || payment.amount == 0"
                class='button'
              >Create Payment</button>
            </form>
          </div>
          <hr>
          <div
            class='create-payment'
            v-if="currentFilters"
          >
            <b>Filters</b>
            <ul>
              <li>
                <span>Name</span>
              </li>
              <div
                v-for='userName in currentFilters.userName'
                v-bind:key='userName'
              >
                <input
                  type="checkbox"
                  v-model="selectedFilters.userName[userName]"
                >
                <label>{{ userName }}</label>
              </div>
              <li>
                <span>Amount</span>
              </li>
              <div
                v-for='amount in currentFilters.amount'
                v-bind:key='amount'
              >
                <input
                  type="checkbox"
                  v-model="selectedFilters.amount[amount]"
                >
                <label>{{ amount }}</label>
              </div>

            </ul>
            <button
              @click='applyFilter'
              class='button'
            >Apply filters</button>
            <a
              @click='resetFilters'
              class='reset-filters'
            >Reset filters</a>
          </div>
        </div>
      </div>
      <transition name='fade'>
        <button
          class='button arrow-button'
          @click='hideSidebar = !hideSidebar'
        >
          <v-icon v-bind:name='hideSidebar ? "arrow-right" : "arrow-left"' />
        </button>
      </transition>
      <div class='col2'>
        <transition name='fade'>
          <div
            v-if='hiddenPayments.length'
            @click='showNewPayments'
            class='hidden-payments'
          >
            <p>
              Click to show <span class='new-payments'>{{ hiddenPayments.length }}</span>
              new <span v-if="hiddenPayments.length > 1">payments</span><span v-else>payment</span>
            </p>
          </div>
        </transition>
        <div v-if='filteredPayments.length'>
          <div class="table-title">
            <h3>Transactions</h3>
          </div>
          <div class="search-container flex justify-between">
            <input
              type="text"
              id="search-bar"
              placeholder="Search"
              @change="search"
            >
          </div>

          <div class="dropdown">
            <div class="btn-group">
              <a
                href="#"
                class="btn dropdown-toggle"
                tabindex="0"
              >
                Bulk actions
                <v-icon
                  name='angle-down'
                  scale="1"
                />
              </a>
              <ul class="menu">
                <li>
                  <a
                    href="#"
                    @click='bulkDelete'
                  >
                    <v-icon
                      name='trash'
                      scale="1"
                    />
                    Delete
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <table class="table-fill">
            <thead>
              <tr>
                <th class="text-left">
                  <div class="flex justify-between">
                    <input
                      type="checkbox"
                      @click='selectAll'
                    />
                  </div>
                </th>
                <th
                  class="text-left table-head"
                  v-bind:class="{ isSelected: sortType === 'id' }"
                  @click="sortBy('id')"
                >
                  <div>ID
                    <v-icon
                      v-if='sortType === "id"'
                      v-bind:name="sortState ? 'arrow-down' : 'arrow-up'"
                    />
                  </div>
                </th>
                <th
                  class="text-left table-head"
                  v-bind:class="{ isSelected: sortType === 'userName' }"
                  @click="sortBy('userName')"
                >
                  <div>Name
                    <v-icon
                      v-if='sortType === "userName"'
                      v-bind:name="sortState ? 'arrow-down' : 'arrow-up'"
                    />
                  </div>
                </th>
                <th
                  class="text-left table-head"
                  v-bind:class="{ isSelected: sortType === 'description' }"
                  @click="sortBy('description')"
                >
                  <div>Description
                    <v-icon
                      v-if='sortType === "description"'
                      v-bind:name="sortState ? 'arrow-down' : 'arrow-up'"
                    />
                  </div>
                </th>
                <th
                  class="text-left table-head"
                  v-bind:class="{ isSelected: sortType === 'createdOn' }"
                  @click="sortBy('createdOn')"
                >
                  <div>Date
                    <v-icon
                      v-if='sortType === "createdOn"'
                      v-bind:name="sortState ? 'arrow-down' : 'arrow-up'"
                    />
                  </div>
                </th>
                <th
                  class="text-left table-head"
                  v-bind:class="{ isSelected: sortType === 'amount' }"
                  @click="sortBy('amount')"
                >
                  <div>Amount
                    <v-icon
                      v-if='sortType === "amount"'
                      v-bind:name="sortState ? 'arrow-down' : 'arrow-up'"
                    />
                  </div>
                </th>
                <th class="text-left">
                  <div>Info</div>
                </th>
              </tr>
            </thead>
            <tbody class="table-hover">
              <tr
                v-for="payment in filteredPayments"
                v-bind:key="payment.id"
              >
                <td class="text-left">
                  <input
                    type="checkbox"
                    v-model="selectedItems[payment.id]"
                  />
                </td>
                <td class="text-left">{{ payment.id }}</td>
                <td class="text-left">{{ payment.userName }}</td>
                <td class="text-left">{{ payment.description | trimLength }}</td>
                <td class="text-left">
                  {{ payment.createdOn | formatHours }} | {{ payment.createdOn | formatDate }}
                </td>
                <td class="text-left">{{ payment.amount }}$</td>
                <td class="text-left"><a @click='viewPayment(payment)' class='view-payment'>
                    <v-icon name="edit" />{{ payment.notes }}</a></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else-if="payments.length">
          <p class='no-results'>
            No results found!
            <a @click='resetFilters'>
              Reset filters
            </a>
          </p>
        </div>
        <div v-else>
          <p class='no-results'>There are currently no payments</p>
        </div>
      </div>
    </section>

    <!-- payment modal -->
    <transition name='fade'>
      <div
        v-if='showPaymentModal'
        class='p-modal'
      >
        <div class='p-container'>
          <a
            @click='closePaymentModal'
            class='close'
          >X</a>
          <div class='payment'>
            <div>
              <div class='flex justify-between'>
                <h5>{{ fullPayment.userName }}</h5>
                <b class='fs-10'>{{ fullPayment.id }}</b>
              </div>
              <div class='flex justify-between'>
                <span>
                  {{ fullPayment.createdOn | formatHours }} |
                  {{ fullPayment.createdOn | formatDate }}
                </span>
                <span>Amount: <b>{{ fullPayment.amount }}$</b></span>
              </div>
            </div>
            <br />
            <label for='description'>Description:</label>
            <br />
            <textarea
              v-model.trim='currentDescription'
              type='text'
              :placeholder="currentDescription"
              id='description'
            />
            <button
              @click='updateDescription'
              :disabled='fullPayment.description === currentDescription'
              class='button w-full'
            >Update Description</button>
            <br/>
            <br/>
            <div class="p-list">
              <h5>Notes: {{ fullPayment.notes }}</h5>
              <a @click='openNoteModal(fullPayment)' class='add-note'>
                Add new note <v-icon name='sticky-note' scale="1"/>
              </a>
            </div>
          </div>
          <div
            v-show='paymentNotes.length'
            class='notes'
          >
            <div
              v-for="note in paymentNotes"
              v-bind:key='note.id'
              class='note'
            >
              <p>{{ note.userName }}</p>
              <span>{{ note.createdOn | formatHours }}</span>
              <p>{{ note.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- note modal -->
    <transition name='fade'>
      <div
        v-if='showNoteModal'
        class='c-modal'
      >
        <div class='c-container'>
          <a @click='closeNoteModal'>X</a>
          <p>Add a note</p>
          <form @submit.prevent>
            <textarea
              v-model.trim='note.description'
              autofocus
            ></textarea>
            <button
              @click='addNote'
              :disabled="note.description == ''"
              class='button'
            >Add note</button>
            </form>
          </div>
        </div>
    </transition>

    <!-- loading -->
    <transition name='fade'>
      <div
        v-if='performingRequest'
        class='loading'
      >
        <p>Loading...</p>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import filters from '../filters/Dashboard';
import methods from '../methods/Dashboard';

export default {
  data() {
    return {
      payment: {
        description: '',
        amount: '',
      },
      note: {
        paymentId: '',
        userId: '',
        description: '',
        paymentNotes: 0,
      },
      showNoteModal: false,
      showPaymentModal: false,
      fullPayment: {},
      paymentNotes: [],
      currentDescription: '',
      hideSidebar: false,
      performingRequest: false,
      selectedItems: {},
      sortType: 'id',
      sortState: true,
      selectedFilters: {
        amount: {},
        userName: {},
      },
    };
  },
  computed: {
    ...mapState([
      'userProfile',
      'currentUser',
      'payments',
      'filteredPayments',
      'hiddenPayments',
      'currentFilters',
      'fb',
    ]),
  },
  methods,
  filters,
};
</script>
