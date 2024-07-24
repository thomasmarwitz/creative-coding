import torch
from transformers import BertTokenizer, BertModel
from sklearn.metrics.pairwise import cosine_similarity
import json


def get_bert_embedding(text, model, tokenizer):
    inputs = tokenizer(
        text, return_tensors="pt", padding=True, truncation=True, max_length=512
    )
    with torch.no_grad():
        outputs = model(**inputs)
    return outputs.last_hidden_state.mean(dim=1).squeeze().numpy()


def process_nouns(file_path, n_nouns: int, n_neighbors: int):
    # Load pre-trained model and tokenizer
    print("Loading pre-trained BERT model and tokenizer...")
    tokenizer = BertTokenizer.from_pretrained("bert-base-uncased")
    model = BertModel.from_pretrained("bert-base-uncased")

    # Read nouns from file
    print("Reading nouns from file...")
    with open(file_path, "r") as f:
        nouns = [line.strip() for line in f if line.strip()]

    nouns = nouns[:n_nouns]

    # Calculate embeddings
    print("Calculating BERT embeddings")
    embeddings = [get_bert_embedding(noun, model, tokenizer) for noun in nouns]

    # Calculate pairwise similarities
    print("Calculating pairwise similarities")
    similarities = cosine_similarity(embeddings)

    # Find N closest neighbors for each noun
    print("Generating graph")
    graph = {"nodes": [], "links": []}
    for i, noun in enumerate(nouns):
        graph["nodes"].append({"id": noun})
        neighbors = similarities[i].argsort()[-n_neighbors - 1 : -1][
            ::-1
        ]  # exclude self
        for neighbor in neighbors:
            graph["links"].append(
                {
                    "source": noun,
                    "target": nouns[neighbor],
                    "similarity": float(
                        similarities[i][neighbor]
                    ),  # Convert to float for JSON serialization
                }
            )

    # Save graph to JSON file
    with open("graph_data.json", "w") as f:
        json.dump(graph, f, indent=4)


if __name__ == "__main__":
    process_nouns(
        "./nouns.txt", n_nouns=50, n_neighbors=3
    )  # You can adjust n_neighbors as needed
