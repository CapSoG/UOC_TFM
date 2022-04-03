import iota_client
import os
import hashlib

rnd_seed = hashlib.sha256(os.urandom(256)).hexdigest()
print(rnd_seed)



# client will connect to testnet by default
client = iota_client.Client()
print(client.get_info())

# Get the seed from environment variable
IOTA_SEED_SECRET = 'b3d7092195c36d47133ff786d4b0a1ef2ee6a0052f6e87b6dc337935c70c531e'
if not IOTA_SEED_SECRET:
    raise Exception("Please define environment variable called `IOTA_SEED_SECRET`")

address_changed_list = client.get_addresses(
    seed=IOTA_SEED_SECRET,
    account_index=0,
    input_range_begin=0,
    input_range_end=10,
    get_all=True
)
print(address_changed_list)

print("Return a balance for a single address:")
print(
    client.get_address_balance("atoi1qp9427varyc05py79ajku89xarfgkj74tpel5egr9y7xu3wpfc4lkpx0l86")
)

print("Return a balance for the given seed and account_index:")
print(
    client.get_balance(
        seed=IOTA_SEED_SECRET,
        account_index=0,
        initial_address_index=0
    )
)

message = client.message()
print(message)
