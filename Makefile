.PHONY: clean diagrams

clean:
	rm diagrams/*.png

diagrams:
	plantuml diagrams/*.puml